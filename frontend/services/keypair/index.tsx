import CURL from "../index";
import { CreateKeypairInput, Keypair } from "./types";

class KEYPAIR {
  public static list = () => CURL.GET<Keypair[], unknown>("/keypair/list");

  public static get = async (id: string) =>
    CURL.GET<Keypair, undefined>(`/keypair/get/${id}`);

  public static create = (body: CreateKeypairInput) =>
    CURL.POST<Keypair, CreateKeypairInput>("/keypair/create", body);

  public static delete = async (id: string) =>
    CURL.DELETE<Keypair, undefined>(`/keypair/delete/${id}`);
}

export default KEYPAIR;
