module.exports = {
  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async up(db, client) {
    console.log("Starting user schema migration...");

    const usersCollection = db.collection("users");

    // Get all users that need migration
    const usersToMigrate = await usersCollection
      .find({
        $or: [
          { role: { $in: ["STAFF", "ADMIN", "CUSTOMER"] } }, // Uppercase roles
          { email_verified_at: { $exists: true } },
          { status: { $exists: false } },
          { isEmailVerified: { $exists: false } },
        ],
      })
      .toArray();

    console.log(`Found ${usersToMigrate.length} users to migrate`);

    // Bulk operations for better performance
    const bulkOps = [];

    for (const user of usersToMigrate) {
      const updates = {};
      const unsets = {};

      // 1. Convert role to lowercase
      if (user.role) {
        updates.role = user.role.toLowerCase();
      }

      // 2. Add status field (default: active)
      if (!user.status) {
        updates.status = "active";
      }

      // 3. Convert email_verified_at to isEmailVerified
      if (user.email_verified_at !== undefined) {
        updates.isEmailVerified = user.email_verified_at !== null;
        unsets.email_verified_at = "";
      } else if (user.isEmailVerified === undefined) {
        updates.isEmailVerified = false;
      }

      // 4. Add twoFactorEnabled (default: false)
      if (user.twoFactorEnabled === undefined) {
        updates.twoFactorEnabled = false;
      }

      // 5. Add favorites array (default: empty)
      if (user.favorites === undefined) {
        updates.favorites = [];
      }

      // 6. Add newsletterSubscribed (default: false)
      if (user.newsletterSubscribed === undefined) {
        updates.newsletterSubscribed = false;
      }

      // 7. Add dateJoined (use createdAt if exists)
      if (!user.dateJoined && user.createdAt) {
        updates.dateJoined = user.createdAt;
      }

      // Build update operation
      const updateOp = {
        updateOne: {
          filter: { _id: user._id },
          update: {},
        },
      };

      if (Object.keys(updates).length > 0) {
        updateOp.updateOne.update.$set = updates;
      }

      if (Object.keys(unsets).length > 0) {
        updateOp.updateOne.update.$unset = unsets;
      }

      bulkOps.push(updateOp);
    }

    // Execute bulk operations
    if (bulkOps.length > 0) {
      const result = await usersCollection.bulkWrite(bulkOps);
      console.log(`Migration completed:`);
      console.log(`  - Modified: ${result.modifiedCount} users`);
      console.log(`  - Matched: ${result.matchedCount} users`);
    } else {
      console.log("No users to migrate");
    }

    // Create indexes for new fields (optional but recommended)
    await usersCollection.createIndex({ status: 1 });
    await usersCollection.createIndex({ isEmailVerified: 1 });

    console.log("User schema migration completed successfully!");
  },

  /**
   * @param db {import('mongodb').Db}
   * @param client {import('mongodb').MongoClient}
   * @returns {Promise<void>}
   */
  async down(db, client) {
    console.log("Rolling back user schema migration...");

    const usersCollection = db.collection("users");

    // Get all users to rollback
    const usersToRollback = await usersCollection
      .find({
        $or: [
          { isEmailVerified: { $exists: true } },
          { status: { $exists: true } },
        ],
      })
      .toArray();

    console.log(`Found ${usersToRollback.length} users to rollback`);

    const bulkOps = [];

    for (const user of usersToRollback) {
      const updates = {};
      const unsets = {};

      // 1. Convert role back to uppercase
      if (user.role) {
        updates.role = user.role.toUpperCase();
      }

      // 2. Convert isEmailVerified back to email_verified_at
      if (user.isEmailVerified !== undefined) {
        updates.email_verified_at = user.isEmailVerified ? new Date() : null;
        unsets.isEmailVerified = "";
      }

      // 3. Remove new fields
      unsets.status = "";
      unsets.twoFactorEnabled = "";
      unsets.favorites = "";
      unsets.newsletterSubscribed = "";
      unsets.dateJoined = "";
      unsets.twoFactorSecret = "";
      unsets.profileImage = "";
      unsets.newsletterSubscribedAt = "";
      unsets.passwordResetToken = "";
      unsets.passwordResetExpires = "";
      unsets.emailVerificationToken = "";
      unsets.emailVerificationExpires = "";
      unsets.lastLogin = "";

      const updateOp = {
        updateOne: {
          filter: { _id: user._id },
          update: {},
        },
      };

      if (Object.keys(updates).length > 0) {
        updateOp.updateOne.update.$set = updates;
      }

      if (Object.keys(unsets).length > 0) {
        updateOp.updateOne.update.$unset = unsets;
      }

      bulkOps.push(updateOp);
    }

    // Execute bulk operations
    if (bulkOps.length > 0) {
      const result = await usersCollection.bulkWrite(bulkOps);
      console.log(`Rollback completed:`);
      console.log(`  - Modified: ${result.modifiedCount} users`);
      console.log(`  - Matched: ${result.matchedCount} users`);
    } else {
      console.log("No users to rollback");
    }

    // Drop indexes created during migration
    try {
      await usersCollection.dropIndex("status_1");
      await usersCollection.dropIndex("isEmailVerified_1");
      console.log("Indexes dropped successfully");
    } catch (error) {
      console.log("Index drop skipped (may not exist)");
    }

    console.log("User schema rollback completed successfully!");
  },
};
