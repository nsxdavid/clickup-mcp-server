# Changelog

All notable changes to the ClickUp MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed
- Fixed `create_list_from_template_in_folder` and `create_list_from_template_in_space` returning HTTP 404. The URL path used `/list/template/{templateId}` (with a slash) instead of `/list_template/{templateId}` (with an underscore), which is what the ClickUp API expects per the [createListFromTemplate](https://developer.clickup.com/reference/createlistfromtemplate) and [createListFromTemplateInSpace](https://developer.clickup.com/reference/createlistfromtemplateinspace) endpoints.

## [1.12.0] - 2025-04-14

### Added
- Added comprehensive descriptions to all MCP resources and resource templates
- Enhanced resource documentation for better discoverability

## [1.11.0] - 2025-03-19

### Added
- Added alternate installation section for npx in README.md
- Added configuration file locations section in both README.md and llms-install.md

### Changed
- Simplified installation instructions in both README.md and llms-install.md
- Improved visual presentation with centered logo and badges
- Updated documentation structure to be more consistent between files
- Enhanced instructions for obtaining and using ClickUp API token

## [1.10.0] - 2025-03-16

### Added
- Enhanced installation instructions in llms-install.md with detailed Node.js setup steps
- Added Windows Package Manager (winget) installation option
- Added detailed explanation of npx and its benefits

### Changed
- Improved documentation for AI assistants to better guide users through setup process

## [1.9.0] - 2025-03-16

### Added
- Added one-click installation option using npx
- Created llms-install.md file for AI assistants

## [1.8.0] - 2025-03-16

### Added
- Published package to npm registry
- Added binary executable support via "bin" field in package.json
- Added npm installation instructions to README.md
- Added npm version badge to README.md

### Changed
- Updated .npmignore to include examples directory in the published package

## [1.7.0] - 2025-03-16

### Changed
- Renamed repository from "clickup-server" to "clickup-mcp-server" to better reflect its purpose
- Updated all references to the repository name in documentation and examples
- Updated package name to match the repository name

## [1.6.0] - 2025-03-16

### Added
- GitVersion.yml for automated semantic versioning
- CODE_OF_CONDUCT.md based on Contributor Covenant
- CONTRIBUTING.md with guidelines for contributors
- CHANGELOG.md to track version history
- Comprehensive README.md with usage examples and documentation
- GitHub's private vulnerability reporting feature
- Dependabot configuration for automated security updates
- GitHub security policy file

### Changed
- Updated CI workflow to use npm install instead of npm ci
- Temporarily disabled linting in CI workflow
- Updated Node.js requirement to 18.0.0 or higher
- Added notes about linting issues in README.md and CONTRIBUTING.md
- Enhanced security policy with GitHub vulnerability reporting

## [1.5.0] - 2025-03-16

### Added
- Complete support for ClickUp comments API
- Threaded comments functionality
- Chat view comments support
- List comments support

### Changed
- Improved error handling in API clients
- Updated to MCP SDK 1.6.1
- Enhanced resource URI templates for better discoverability

### Fixed
- Authentication token handling in API requests
- Error response formatting in tool handlers

## [1.4.0] - 2025-02-20

### Added
- Support for ClickUp checklists API
- Checklist item management
- Task checklist integration

### Changed
- Refactored client architecture for better maintainability
- Improved logging for debugging

## [1.3.0] - 2025-01-15

### Added
- Support for ClickUp docs API
- Document content retrieval
- Document search functionality
- Document page management

### Fixed
- Resource URI template handling
- Error handling in API clients

## [1.2.0] - 2024-12-10

### Added
- Support for ClickUp spaces and folders
- List management functionality
- Folder operations

### Changed
- Improved MCP resource implementation
- Enhanced error reporting

## [1.1.0] - 2024-11-05

### Added
- Task management functionality
- Task creation and updating
- Task details retrieval

### Changed
- Updated to MCP SDK 1.5.0
- Improved authentication handling

## [1.0.0] - 2024-10-01

### Added
- Initial release
- Basic ClickUp API integration
- Workspace management
- MCP server implementation
- Authentication handling
