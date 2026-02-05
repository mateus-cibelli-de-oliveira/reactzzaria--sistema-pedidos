import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { authPedidos, dbPedidos } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";

/**
 * loginWithEmail
 *
 * Esta função permite que um usuário existente faça login usando
 * seu email e senha cadastrados. Funciona como uma porta de entrada
 * tradicional de um sistema de autenticação.
 *
 * Passo a passo:
 * 1. Chamamos signInWithEmailAndPassword passando o auth do Firebase,
 *    o email e a senha fornecidos pelo usuário.
 * 2. Se houver algum problema (senha errada, usuário não existe, etc.),
 *    o erro é capturado e mostrado no console.
 */
export const loginWithEmail = async (email, password) => {
  try {
    await signInWithEmailAndPassword(authPedidos, email, password);
  } catch (error) {
    console.error("Erro no login com email:", error);
    throw error;
  }
};

/**
 * registerWithEmail
 *
 * Esta função cria um novo usuário usando email e senha, e também
 * cria o perfil inicial do usuário no Firestore.
 * É como um kit de boas-vindas que garante que o usuário esteja
 * pronto para usar o sistema assim que terminar o cadastro.
 *
 * Passo a passo:
 * 1. Chamamos createUserWithEmailAndPassword para criar a conta.
 * 2. Atualizamos o displayName do usuário no Firebase Authentication
 *    para que ele já tenha um nome associado.
 * 3. Criamos um objeto "perfil" que será salvo no Firestore, contendo
 *    nome, email e função padrão ("user").
 * 4. Usamos setDoc para gravar o perfil na coleção de usuários do Firestore.
 * 5. Retornamos os dados do usuário para quem chamou a função.
 */
export const registerWithEmail = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(authPedidos, email, password);

    // Atualiza o nome do usuário no Firebase Authentication!
    await updateProfile(result.user, { displayName: name });

    // Cria o perfil inicial no Firestore.
    const newProfile = {
      name,
      email,
      role: "user"
    };
    const userRef = doc(dbPedidos, "users", result.user.uid);
    await setDoc(userRef, newProfile);

    // Retorna os dados do usuário recém-criado.
    return {
      user: result.user,
      profile: newProfile
    };
  } catch (error) {
    console.error("Erro no cadastro com email:", error);
    throw error;
  }
}
