/**
 * Schema Validation Script
 * Validates all JSON-LD structured data in built HTML files
 * Runs after SSG build to catch schema errors before deployment
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

interface ValidationIssue {
  file: string;
  schemaType: string;
  issue: string;
  severity: 'error' | 'warning';
}

const REQUIRED_SCHEMA_TYPES = {
  // Homepage only shows hero section (desktop multi-page layout)
  '/index.html': ['Organization', 'WebSite', 'VideoGame', 'WebPage'],
  '/downloads.html': ['Organization', 'BreadcrumbList', 'SoftwareApplication', 'HowTo', 'WebPage'],
  '/faq.html': ['Organization', 'BreadcrumbList', 'FAQPage', 'WebPage'],
  '/statistics.html': ['Organization', 'BreadcrumbList', 'WebPage'],
  '/community.html': ['Organization', 'BreadcrumbList', 'WebPage'],
};

const issues: ValidationIssue[] = [];

function extractSchemas(html: string): Array<{ type: string; data: any }> {
  const schemas: Array<{ type: string; data: any }> = [];
  const scriptRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const jsonContent = match[1];
      const data = JSON.parse(jsonContent);
      const type = data['@type'] || 'Unknown';
      schemas.push({ type, data });
    } catch (error) {
      issues.push({
        file: 'unknown',
        schemaType: 'parse-error',
        issue: `Failed to parse JSON-LD: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error',
      });
    }
  }

  return schemas;
}

function validateSchema(file: string, type: string, data: any): void {
  // Basic required fields validation
  const requiredByType: Record<string, string[]> = {
    Organization: ['@context', '@type', 'name', 'url'],
    WebSite: ['@context', '@type', 'name', 'url'],
    BreadcrumbList: ['@context', '@type', 'itemListElement'],
    SoftwareApplication: ['@context', '@type', 'name', 'applicationCategory'],
    HowTo: ['@context', '@type', 'name', 'step'],
    VideoGame: ['@context', '@type', 'name'],
    WebPage: ['@context', '@type', 'url', 'name'],
    FAQPage: ['@context', '@type', 'mainEntity'],
  };

  const requiredFields = requiredByType[type];
  if (!requiredFields) {
    // Unknown type, just warn
    issues.push({
      file,
      schemaType: type,
      issue: `Unknown schema type: ${type}`,
      severity: 'warning',
    });
    return;
  }

  // Check all required fields
  for (const field of requiredFields) {
    if (field === '@context') {
      if (data['@context'] !== 'https://schema.org') {
        issues.push({
          file,
          schemaType: type,
          issue: `Invalid @context: expected "https://schema.org", got "${data['@context']}"`,
          severity: 'error',
        });
      }
    } else if (field === '@type') {
      if (data['@type'] !== type) {
        issues.push({
          file,
          schemaType: type,
          issue: `Mismatched @type: expected "${type}", got "${data['@type']}"`,
          severity: 'error',
        });
      }
    } else if (!data[field]) {
      issues.push({
        file,
        schemaType: type,
        issue: `Missing required field: ${field}`,
        severity: 'error',
      });
    }
  }

  // Type-specific validations
  if (type === 'BreadcrumbList') {
    const items = data.itemListElement || [];
    if (items.length < 2) {
      issues.push({
        file,
        schemaType: type,
        issue: 'BreadcrumbList should have at least 2 items',
        severity: 'warning',
      });
    }
  }

  if (type === 'HowTo') {
    const steps = data.step || [];
    if (steps.length < 2) {
      issues.push({
        file,
        schemaType: type,
        issue: 'HowTo should have at least 2 steps',
        severity: 'warning',
      });
    }
  }

  if (type === 'FAQPage') {
    const questions = data.mainEntity || [];
    if (questions.length === 0) {
      issues.push({
        file,
        schemaType: type,
        issue: 'FAQPage should have at least one question',
        severity: 'error',
      });
    }
  }
}

function validateFile(filePath: string, fileName: string): void {
  const html = readFileSync(filePath, 'utf-8');
  const schemas = extractSchemas(html);

  // Check for required schema types
  const requiredTypes = REQUIRED_SCHEMA_TYPES[`/${fileName}`] || [];
  const foundTypes = schemas.map(s => s.type);

  for (const requiredType of requiredTypes) {
    if (!foundTypes.includes(requiredType)) {
      issues.push({
        file: fileName,
        schemaType: requiredType,
        issue: `Missing required schema type: ${requiredType}`,
        severity: 'error',
      });
    }
  }

  // Validate each schema
  for (const schema of schemas) {
    validateSchema(fileName, schema.type, schema.data);
  }
}

function main() {
  console.log('🔍 Validating structured data schemas...\n');

  const distDir = join(process.cwd(), 'dist');
  const htmlFiles = readdirSync(distDir).filter(f => f.endsWith('.html') && f !== 'stats.html' && f !== '404.html');

  for (const file of htmlFiles) {
    validateFile(join(distDir, file), file);
  }

  // Report results
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  if (issues.length === 0) {
    console.log('✅ All schemas validated successfully!\n');
    process.exit(0);
  }

  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):\n`);
    for (const error of errors) {
      console.log(`  ${error.file} [${error.schemaType}]: ${error.issue}`);
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):\n`);
    for (const warning of warnings) {
      console.log(`  ${warning.file} [${warning.schemaType}]: ${warning.issue}`);
    }
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ Schema validation failed. Fix errors before deploying.\n');
    process.exit(1);
  } else {
    console.log('✅ No errors found. Warnings should be reviewed but don\'t block deployment.\n');
    process.exit(0);
  }
}

main();
