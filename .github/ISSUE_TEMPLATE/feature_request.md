name: ✨ Feature Request
description: Suggest an idea for Hermes Companion
title: "[Feature] "
labels: ["enhancement", "needs-triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a feature! We love hearing new ideas.
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear and concise description of what the problem is
      placeholder: "I'm always frustrated when..."
  - type: textarea
    id: solution
    attributes:
      label: Describe the solution you'd like
      description: A clear and concise description of what you want to happen
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Describe alternatives you've considered
      description: Any alternative solutions or features you've considered
  - type: textarea
    id: use-case
    attributes:
      label: Use Case
      description: How would this feature be used? Who would benefit from it?
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How important is this feature to you?
      options:
        - Nice to have
        - Would make my life easier
        - Critical for my workflow
    validations:
      required: true
  - type: textarea
    id: additional
    attributes:
      label: Additional Context
      description: Add any other context, mockups, or screenshots about the feature request
