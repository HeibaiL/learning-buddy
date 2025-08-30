export interface TextExtractor {
  extract(params: { bytes: Uint8Array; filename: string; mime?: string }): Promise<string>;
}
