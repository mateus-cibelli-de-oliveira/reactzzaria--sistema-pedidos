import { PureComponent } from "react";

class ErrorBoundary extends PureComponent {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Erro capturado pelo ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Deu erro!</h1>;
    }
    return this.props.children(this.state.hasError);
  }
}

export default ErrorBoundary;
