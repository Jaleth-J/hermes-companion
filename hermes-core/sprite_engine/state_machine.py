"""
Sprite Engine - Rule-based state machine for Hermes Companion
Zero token cost - all decisions are deterministic based on events
"""

import time
from enum import Enum
from typing import Optional, Dict, Any
from dataclasses import dataclass, field


class SpriteState(Enum):
    """Available sprite emotional states"""
    IDLE = "idle"
    LISTENING = "listening"
    THINKING = "thinking"
    HAPPY = "happy"
    WORRIED = "worried"
    ERROR = "error"


@dataclass
class SpriteEvent:
    """Event that triggers sprite state changes"""
    event_type: str  # "user_input", "tool_start", "tool_complete", "timeout"
    tool_name: Optional[str] = None
    tool_params: Optional[Dict[str, Any]] = None
    success: Optional[bool] = None
    timestamp: float = field(default_factory=time.time)


class SpriteStateMachine:
    """
    Rule-based sprite state machine.
    
    Zero API token cost - all state decisions are deterministic.
    Triggers based on:
    - User activity (typing, voice input)
    - Tool execution (start, complete, error)
    - Timeouts (idle detection)
    """
    
    def __init__(self, idle_timeout: float = 3.0):
        self.state = SpriteState.IDLE
        self.last_activity = time.time()
        self.active_tool_calls = 0
        self.dangerous_operation = False
        self.idle_timeout = idle_timeout
        
        # Dangerous patterns for worried state
        self.dangerous_patterns = [
            "rm -rf",
            "sudo",
            "DROP TABLE",
            "DELETE FROM",
            "chmod 777",
            "mkfs",
            "dd if=",
            ":(){:|:&};:",
        ]
    
    def process_event(self, event: SpriteEvent) -> SpriteState:
        """Process an event and return the new state"""
        self.last_activity = time.time()
        
        if event.event_type == "user_input":
            return self._on_user_input()
        
        elif event.event_type == "tool_start":
            return self._on_tool_start(event.tool_name, event.tool_params)
        
        elif event.event_type == "tool_complete":
            return self._on_tool_complete(event.success)
        
        elif event.event_type == "timeout":
            return self._on_timeout()
        
        # Unknown event, stay in current state
        return self.state
    
    def _on_user_input(self) -> SpriteState:
        """User started typing or speaking"""
        self.state = SpriteState.LISTENING
        return self.state
    
    def _on_tool_start(self, tool_name: Optional[str], params: Optional[Dict]) -> SpriteState:
        """Tool execution started"""
        self.active_tool_calls += 1
        
        # Check if this is a dangerous operation
        if self._is_dangerous(tool_name, params):
            self.state = SpriteState.WORRIED
            self.dangerous_operation = True
        else:
            self.state = SpriteState.THINKING
        
        return self.state
    
    def _on_tool_complete(self, success: Optional[bool]) -> SpriteState:
        """Tool execution completed"""
        self.active_tool_calls = max(0, self.active_tool_calls - 1)
        
        if self.active_tool_calls == 0:
            # No more active tools, determine state
            if not success:
                self.state = SpriteState.ERROR
            elif self.dangerous_operation:
                # Dangerous operation completed successfully
                self.state = SpriteState.IDLE
            else:
                self.state = SpriteState.HAPPY
            
            self.dangerous_operation = False
        
        return self.state
    
    def _on_timeout(self) -> SpriteState:
        """Idle timeout triggered"""
        if time.time() - self.last_activity > self.idle_timeout:
            self.state = SpriteState.IDLE
        return self.state
    
    def _is_dangerous(self, tool_name: Optional[str], params: Optional[Dict]) -> bool:
        """
        Check if operation is dangerous (rule-based, no LLM).
        Returns True if we should show worried state.
        """
        if tool_name == "terminal" and params:
            command = str(params.get("command", ""))
            return any(pattern in command for pattern in self.dangerous_patterns)
        
        if tool_name == "send_message" and params:
            # Money-related keywords
            money_patterns = ["buy", "purchase", "payment", "€", "$", "transfer"]
            message = str(params.get("message", ""))
            return any(pattern.lower() in message.lower() for pattern in money_patterns)
        
        if tool_name in ["patch", "write_file"] and params:
            # Modifying critical files
            critical_files = ["/etc/", "/boot/", "passwd", "shadow", "sudoers"]
            path = str(params.get("path", ""))
            return any(critical in path for critical in critical_files)
        
        return False
    
    def check_idle(self) -> SpriteState:
        """Check if we should transition to idle state"""
        if time.time() - self.last_activity > self.idle_timeout:
            return self._on_timeout()
        return self.state
    
    def get_state(self) -> SpriteState:
        """Get current state"""
        return self.state
    
    def reset(self):
        """Reset state machine to initial state"""
        self.state = SpriteState.IDLE
        self.last_activity = time.time()
        self.active_tool_calls = 0
        self.dangerous_operation = False


# Example usage / test
if __name__ == "__main__":
    machine = SpriteStateMachine()
    
    print(f"Initial state: {machine.get_state().value}")
    
    # User starts typing
    event = SpriteEvent(event_type="user_input")
    print(f"After user_input: {machine.process_event(event).value}")
    
    # Tool starts (normal)
    event = SpriteEvent(
        event_type="tool_start",
        tool_name="terminal",
        tool_params={"command": "ls -la"}
    )
    print(f"After tool_start: {machine.process_event(event).value}")
    
    # Tool completes successfully
    event = SpriteEvent(
        event_type="tool_complete",
        success=True
    )
    print(f"After tool_complete (success): {machine.process_event(event).value}")
    
    # Dangerous operation
    event = SpriteEvent(
        event_type="tool_start",
        tool_name="terminal",
        tool_params={"command": "rm -rf /tmp/test"}
    )
    print(f"After dangerous tool_start: {machine.process_event(event).value}")
    
    # Tool completes
    event = SpriteEvent(event_type="tool_complete", success=True)
    print(f"After tool_complete: {machine.process_event(event).value}")
