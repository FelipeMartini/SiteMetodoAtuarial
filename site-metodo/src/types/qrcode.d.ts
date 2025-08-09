// Declaração mínima para módulo 'qrcode' enquanto tipos oficiais não instalados
declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    type?: string
    rendererOpts?: { quality?: number }
    margin?: number
    scale?: number
    width?: number
    color?: { dark?: string; light?: string }
  }
  function toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>
  export { toDataURL }
  const _default: { toDataURL: typeof toDataURL }
  export default _default
}
