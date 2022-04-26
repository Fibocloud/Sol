export interface Keypair {
  name: string;
  fingerprint: string;
  public_key: string;
  private_key: string;
  user_id: string;
  type: string;
}

export interface CreateKeypairInput {
  name: string;
  public_key: string;
}
