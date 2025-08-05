#!/bin/bash

// This script is a deployment guard for Vercel, allowing deployment only from specified branches.
// add this script to vercel/settings/Ignored Build Step in the Vercel dashboard.
// Select Run my node script and add the script as below:
// "node src/utils/node-scripts/vercel-branch-deploy-guard.js "main,dev,skeleton"

// Retrieve allowed branches as a comma-separated argument (e.g., "main,dev,skeleton").
const allowedBranchesArg = process.argv[2];

if (!allowedBranchesArg) {
	console.error('🛑 No branches provided for deployment check.');
	process.exit(1); // Exit if no branches are specified.
}

// Split the allowed branches into an array for validation.
const allowedBranches = allowedBranchesArg.split(',');

// Get the current branch from the Vercel environment variable.
const currentBranch = process.env.VERCEL_GIT_COMMIT_REF;

if (!currentBranch) {
	console.error('🛑 VERCEL_GIT_COMMIT_REF is not defined.');
	process.exit(0); // Exit with no error if branch info is unavailable (deployment continues).
}

// Check if the current branch is in the allowed branches list.
if (allowedBranches.includes(currentBranch)) {
	console.log(`✅ Deploying branch '${currentBranch}'.`);
	process.exit(1); // Allow deployment to continue for authorized branches.
} else {
	console.log(`🛑 Deployment skipped for branch '${currentBranch}'.`);
	process.exit(0); // Stop deployment for unauthorized branches.
}
