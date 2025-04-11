import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Get command line arguments
const args = process.argv.slice(2)
const env = args[0]?.toLowerCase()

// Validate environment parameter
if (!['dev', 'test', 'prod'].includes(env)) {
  console.error('Invalid environment. Must be one of: dev, test, prod')
  process.exit(1)
}

async function main() {
  // Get all SQL files from the data directory
  const dataDir = path.join(process.cwd(), 'data')
  const sqlFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.sql'))
    .sort() // Sort files by name (ascending order)

  console.log(`Found ${sqlFiles.length} SQL files to process`)
  console.log(`Environment: ${env}`)

  // Filter SQL files based on environment parameter
  const envFiles = sqlFiles.filter(file => {
    // Extract environment part from filename
    const match = file.match(/^\d{8}-\d{3}_([a-zA-Z]+)_/)
    if (!match) return false
    
    const fileEnv = match[1].toLowerCase()
    // Execute scripts for current environment and 'all' environment
    return fileEnv === env || fileEnv === 'all'
  })

  console.log(`Processing ${envFiles.length} files for environment: ${env}`)

  // Process each SQL file
  for (const sqlFile of envFiles) {
    console.log(`Processing file: ${sqlFile}`)
    const filePath = path.join(dataDir, sqlFile)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // Split content into lines
    const lines = fileContent.split('\n')
    
    let currentStatement = ''
    let isCollectingStatement = false
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines
      if (!line) continue
      
      // Check if line starts with a SQL keyword
      if (line.match(/^(INSERT|UPDATE|DELETE|SELECT|MERGE|REPLACE|CALL|EXECUTE|EXEC|SET)/i)) {
        // If we were collecting a statement, execute it first
        if (isCollectingStatement && currentStatement) {
          await executeSqlStatement(currentStatement)
          currentStatement = ''
        }
        
        // Start collecting a new statement
        currentStatement = line
        isCollectingStatement = true
        
        // Check if statement ends with semicolon
        if (line.endsWith(';')) {
          // Statement is complete, execute it
          await executeSqlStatement(currentStatement)
          currentStatement = ''
          isCollectingStatement = false
        }
      } else if (isCollectingStatement) {
        // Continue collecting the current statement
        currentStatement += ' ' + line
        
        // Check if statement ends with semicolon
        if (line.endsWith(';')) {
          // Statement is complete, execute it
          await executeSqlStatement(currentStatement)
          currentStatement = ''
          isCollectingStatement = false
        }
      }
      // Ignore lines that don't start with a SQL keyword
    }
    
    // Execute any remaining statement
    if (isCollectingStatement && currentStatement) {
      await executeSqlStatement(currentStatement)
    }
  }
  
  console.log('Data migration completed successfully')
}

async function executeSqlStatement(sql: string) {
  try {
    // Remove trailing semicolon if present
    const cleanSql = sql.trim().replace(/;$/, '')
    
    // Execute the SQL statement
    await prisma.$executeRawUnsafe(cleanSql)
    console.log(`Executed: ${cleanSql.substring(0, 80)}${cleanSql.length > 80 ? '...' : ''}`)
  } catch (error) {
    // Check if error is a Prisma error with code P2010 (raw query error)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2010') {
      const meta = (error as any).meta || {}
      const errorCode = meta.code
      const errorMessage = meta.message || ''
      
      // Check for unique constraint violations across different database systems
      // SQLite: error code 1555
      // MySQL: error code 1062
      // PostgreSQL/CockroachDB: error code 23505
      // MSSQL: error code 2627 or 2601
      // MongoDB: error code 11000
      if (
        errorCode === '1555' || // SQLite
        errorCode === '1062' || // MySQL
        errorCode === '23505' || // PostgreSQL/CockroachDB
        errorCode === '2627' || // MSSQL
        errorCode === '2601' || // MSSQL
        errorCode === '11000' || // MongoDB
        errorMessage.includes('UNIQUE constraint failed') || // SQLite
        errorMessage.includes('Duplicate entry') || // MySQL
        errorMessage.includes('duplicate key value violates unique constraint') || // PostgreSQL/CockroachDB
        errorMessage.includes('Violation of UNIQUE KEY constraint') || // MSSQL
        errorMessage.includes('Cannot insert duplicate key row') || // MSSQL
        errorMessage.includes('duplicate key error') || // MongoDB
        errorMessage.includes('E11000 duplicate key error') // MongoDB
      ) {
        // Ignore duplicate key errors
        console.log(`Ignored duplicate key error: ${errorMessage}`)
        return
      }
    }
    
    // For other errors, log and rethrow
    console.error(`Error executing SQL: ${error instanceof Error ? error.message : String(error)}`)
    console.error(`Failed SQL: ${sql}`)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
