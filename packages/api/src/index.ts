/**
 * @repo/api Package
 *
 * Shared DTOs and types used by both frontend and backend.
 * This package provides a single source of truth for API contracts.
 *
 * Structure:
 * - common.ts: Base schemas and utilities used by all DTOs
 * - [entity].ts: Entity-specific DTOs (e.g., assignments.ts, courses.ts)
 * - links/: Legacy example DTOs (to be removed)
 */

import { Link } from 'links/entities/link.entity';
import { CreateLinkDto } from 'links/dto/create-link.dto';
import { UpdateLinkDto } from 'links/dto/update-link.dto';

// ============================================================================
// Common Types and Schemas - Used by all DTOs
// ============================================================================

export * from './common';

// ============================================================================
// Entity-Specific DTOs
// ============================================================================

export * from './assignments';

// Note: Additional entity DTOs will be exported here as they are created
// Example:
// export * from './courses';
// export * from './submissions';

// ============================================================================
// Legacy Example (Links) - To be removed
// ============================================================================

export const links = {
  dto: {
    CreateLinkDto,
    UpdateLinkDto,
  },
  entities: {
    Link,
  },
};
