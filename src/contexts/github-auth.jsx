import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { authPedidos } from "@/services/firebase";

/**
 * loginWithGitHub
 *
 * Esta função cuida de todo o processo de login usando o GitHub.
 * Pense nela como um portal que abre a janela do GitHub, pede ao usuário
 * para autorizar o aplicativo e, se tudo der certo, conecta o usuário à aplicação.
 *
 * O fluxo é simples:
 * 1. Criamos um provedor do GitHub, que é o que permite o Firebase saber
 *    que queremos usar esse método de login específico.
 * 2. Chamamos signInWithPopup passando esse provedor, o que abre uma
 *    janela para o usuário se autenticar.
 * 3. Se der algum erro (por exemplo, o usuário cancelar o login ou
 *    houver algum problema de conexão), capturamos e mostramos no console.
 */
export const loginWithGitHub = async () => {
  try {
    const provider = new GithubAuthProvider();
    await signInWithPopup(authPedidos, provider);
  } catch (error) {
    // Aqui estamos apenas registrando o erro para saber o que aconteceu!
    console.error("Erro no login com GitHub:", error);
    // Propagamos o erro para quem chamou a função poder lidar com ele também!
    throw error;
  }
}
