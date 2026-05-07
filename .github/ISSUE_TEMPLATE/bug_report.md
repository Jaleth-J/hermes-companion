name: 🐛 Bug Report
description: File a bug report
title: "[Bug] "
labels: ["bug", "needs-triage"]
assignees: []
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report! Please provide as much detail as possible.
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us what you expected to happen
      placeholder: "The sprite got stuck in thinking state after..."
    validations:
      required: true
  - type: textarea
    id: reproduce
    attributes:
      label: Steps to Reproduce
      description: How can we reproduce this issue?
      placeholder: |
        1. Open the app
        2. Click on '...'
        3. Run command '...'
        4. See error
    validations:
      required: true
  - type: dropdown
    id: os
    attributes:
      label: Operating System
      description: Which OS are you using?
      options:
        - Windows 11
        - Windows 10
        - macOS 14+ (Sonoma)
        - macOS 13 (Ventura)
        - Ubuntu 22.04
        - Ubuntu 20.04
        - Fedora
        - Arch Linux
        - Other Linux
    validations:
      required: true
  - type: input
    id: version
    attributes:
      label: App Version
      description: What version of Hermes Companion are you running? (Check in Settings > About)
      placeholder: "e.g., 0.1.0"
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Relevant Log Output
      description: Please copy and paste any relevant error messages or logs
      render: shell
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots
      description: If applicable, add screenshots to help explain your problem
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true
