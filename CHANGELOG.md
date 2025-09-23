# Changelog

All notable changes to this project will be documented in this file.

## [v0.1.0] – 2025-09-23

### Added

#### User-Facing Features
- **Audit Logs Tool** (`getAuditLogsTool`)  
  - Fetch audit logs from Discord servers with type validation  
  - Supports `limit` (1–100), pagination (`before`, `after`)  
  - Returns structured data (executor, target, changes)  

- **Channel Permissions Management** (`manageChannelPermissionsTool`)  
  - Manage channel permission overwrites for roles/users  
  - `createChannelTool` updated to support permission overwrites  

#### Developer-Facing Features
- **Logging System Overhaul**  
  - New `AuditLogger` with interval-based flushing  
  - Added `CompositeLogger` for multi-logger aggregation  
  - Standardized timestamp formatting across all loggers  
  - Centralized logging utilities under `utils/logger/`  

- **Constructor Options Pattern**  
  - All major classes now use options objects (`{ ... }`) instead of positional args  
  - Applied to `PromptBuilder`, `AuditLogger`, `ConsoleLogger`, `CompositeLogger`  
  - Improved type safety, defaults, and maintainability  

---

### Changed

#### User-Facing
- **Permission Handling**  
  - Replaced `PermissionSchema` → `permissionSchema` & `permissionOverwriteSchema`  
  - Better consistency and alignment with Discord’s `PermissionsBitField`  

#### Developer-Facing
- **Imports**  
  - Migrated to alias-based imports (`@/tools/...`, `@/core/...`)  
  - Improves readability and maintainability  

- **Code Cleanup**  
  - Removed redundant optional calls and unused imports  
  - Improved code readability and structure  

---

### Technical Details

#### Logging System
- Introduced `BaseLogger` for shared timestamp formatting  
- `CompositeLogger` supports logging to multiple outputs  
- `AuditLogger` supports interval-based flushing  
- Updated `AIEngine`, `DiscordRouter`, `PromptBuilder`, `RateLimiter`, `ToolRegistry` to use new loggers  

#### Permission System
- Stronger type safety with Zod schemas  
- Updated `createChannelTool`, `manageChannelPermissionsTool`, `createRoleTool`, `updateRoleTool`  

#### Constructor API
- All constructors now use `options` pattern  
- Default params handled consistently  
- Reduced parameter-ordering issues  

#### Audit Logs
- Full audit log event type support with validation  
- Error handling and type-safe structured results  
