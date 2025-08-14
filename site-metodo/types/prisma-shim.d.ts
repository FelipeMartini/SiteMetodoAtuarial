declare module '@prisma/client' {
  export class PrismaClient {
    constructor(opts?: any)
    $connect(): Promise<void>
    $disconnect(): Promise<void>
    $queryRaw(...args: any[]): Promise<any>
    // Models used in the project (shim)
    user?: any
    accessLog?: any
    casbinRule?: any
    [key: string]: any
  }
  export default PrismaClient
}
