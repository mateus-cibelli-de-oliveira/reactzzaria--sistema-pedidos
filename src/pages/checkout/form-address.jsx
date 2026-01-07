import { useState, useEffect, useReducer, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  FormColumn,
  FormRow,
  FlexItem,
  CepContainer,
  FetchingCepInfo,
} from "./form-layout";
import TextField from "./text-field";

function FormAddress({ onUpdate = () => {} }) {
  const [cep, setCep] = useState("");
  const [fetchingCep, setFetchingCep] = useState(false);
  const [addressState, dispatch] = useReducer(reducer, initialState);

  // Usada somente quando o CEP for válido
  const numberField = useRef(null);

  // Usada somente quando ocorrer erro técnico (HTTPS / HTTP / rede)
  const addressField = useRef(null);

  useEffect(() => {
    onUpdate(addressState)
  }, [addressState, onUpdate]);

  // Exemplo de CEP para teste no ViaCEP: 06233-030
  useEffect(() => {
    async function fetchAddress() {
      if (cep.length < 9) return;

      const cepWithoutMask = cep.replace("-", "");

      setFetchingCep(true);

      // Limpa qualquer erro anterior antes de uma nova tentativa
      dispatch({ type: "CLEAR_ERROR" });

      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepWithoutMask}/json/`
        );

        // Erro HTTP real (rede / HTTPS / servidor)
        if (!response.ok) {
          dispatch({
            type: "FAIL",
            payload: { error: "TECHNICAL_ERROR" }
          });
          return;
        }

        const result = await response.json();

        // CEP digitado, mas não encontrado (erro de domínio)
        if (result.erro) {
          dispatch({
            type: "FAIL",
            payload: { error: "CEP_NOT_FOUND" }
          });
          return;
        }

        // CEP válido → popula o endereço
        dispatch({
          type: "UPDATE_FULL_ADDRESS",
          payload: {
            code: result.cep,
            address: result.logradouro,
            district: result.bairro,
            complement: result.complemento,
            city: result.localidade,
            state: result.uf
          }
        });
      } catch {
        dispatch({
          type: "FAIL",
          payload: { error: "TECHNICAL_ERROR" }
        });
      } finally {
        setFetchingCep(false);
      }
    }

    fetchAddress();
  }, [cep]);

  // Somente quando o CEP foi resolvido com sucesso
  useEffect(() => {
    if (!fetchingCep && addressState.cepStatus === "success") {
      numberField.current?.focus();
    }
  }, [fetchingCep, addressState.cepStatus]);

  // Somente quando ocorrer erro técnico
  useEffect(() => {
    if (!fetchingCep && addressState.cepStatus === "technical_error") {
      addressField.current?.focus();
    }
  }, [fetchingCep, addressState.cepStatus]);

  // HANDLERS
  function handleChangeCep(e) {
    setCep(cepMask(e.target.value));
  }

  function handleChangeAddress(e) {
    const { name, value } = e.target;

    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value
    });
  }

  function cepMask(value) {
    return value
      .replace(/\D+/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  }

  return (
    <FormColumn>
      <FormRow>
        <CepContainer>
          <TextField
            label="CEP"
            name="cep"
            autoFocus
            value={cep}
            onChange={handleChangeCep}
            error={!!addressState.error}
          />
        </CepContainer>

        {fetchingCep && (
          <FetchingCepInfo>
            <CircularProgress size={20} />
          </FetchingCepInfo>
        )}
      </FormRow>

      <FormRow>
        {[
          { label: "Rua", name: "address", grow: 5 },
          { label: "Número", name: "number", grow: 1 },
        ].map(({ label, name, grow }) => (
          <FlexItem key={name} grow={grow}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={addressState[name]}
              onChange={handleChangeAddress}
              disabled={fetchingCep}
              inputRef={
                name === "number"
                  ? numberField
                  : name === "address"
                  ? addressField
                  : null
              }
            />
          </FlexItem>
        ))}
      </FormRow>

      <TextField
        fullWidth
        label="Complemento"
        name="complement"
        value={addressState.complement}
        onChange={handleChangeAddress}
        disabled={fetchingCep}
      />

      <FormRow>
        {[
          { label: "Cidade", name: "city", grow: 5 },
          { label: "Estado", name: "state", grow: 1 },
        ].map(({ label, name, grow }) => (
          <FlexItem key={name} grow={grow}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={addressState[name]}
              onChange={handleChangeAddress}
              disabled={fetchingCep}
            />
          </FlexItem>
        ))}
      </FormRow>
    </FormColumn>
  );
}

// REDUCER
function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FULL_ADDRESS":
      return {
        ...state,
        ...action.payload,
        error: null,
        cepStatus: "success"
      }

    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value
      }

    case "FAIL":
      return {
        ...initialState,
        error: action.payload.error,
        cepStatus:
          action.payload.error === "TECHNICAL_ERROR"
            ? "technical_error"
            : "not_found"
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
        cepStatus: "idle"
      }

    default:
      return state;
  }
}

const initialState = {
  code: "",
  address: "",
  number: "",
  district: "",
  complement: "",
  city: "",
  state: "",
  error: null,
  cepStatus: "idle", // idle | success | technical_error | not_found
}

export default FormAddress;
