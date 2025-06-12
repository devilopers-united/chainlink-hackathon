import {
    pgTable,
    text,
    uuid,
    integer,
    boolean,
    timestamp
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/*
  Files Table
 
  This table stores all files and folders in our Droply.
  - Both files and folders are stored in the same table
  - Folders are identified by the isFolder flag
  - Files/folders can be nested using the parentId (creating a tree structure)
 */
export const files = pgTable("files", {
    // Unique identifier for each file/folder
    id: uuid("id").defaultRandom().primaryKey(),

    // Basic file/folder information
    name: text("name").notNull(),
    path: text("path").notNull(), // Full path to the file/folder
    size: integer("size").notNull(), // Size in bytes (0 for folders)
    type: text("type").notNull(), // MIME type for files, "folder" for folders

    // Storage information
    fileUrl: text("file_url").notNull(), // URL to access file 
    thumbnailUrl: text("thumbnail_url"), // Optional thumbnail for images/documents

    // Ownership information
    userId: text("user_id").notNull(), // Owner of the file/folder
    parentId: uuid("parent_id"), // Parent folder id (null for root items)

    // File/Folder flags
    isFolder: boolean("is_folder").default(false).notNull(), // Whether this is a folder
    isStarred: boolean("is_starred").default(false).notNull(), // Starred/favorite items
    isTrash: boolean("is_trash").default(false).notNull(), // Items in trsh

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
  File Relations
 
  This defines the relationships between records in our files table:
  1. parent - Each file/folder can have one parent folder
  2. children - Each folder can have many child files/folders
 
  This creates a hierarchical file structure similar to a real filesystem.
 */

export const filesRelations = relations(files, ({ one, many }) => ({
    // Relationship to parent folder
    parent: one(files, {
        fields: [files.parentId], // The foreign key in this table
        references: [files.id], // The primary key in the parent table
    }),

    // Relationship to child files/folders
    children: many(files)
}));

/*
  Type Definitions
  
  These types help with TypeScript integration:
  - File: Type for retrieving file data from the database
  - NewFile: Type for inserting new file data into the database
 */
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert