class StateService {
  private state: Record<string, string> = {};
  private initialized = false;

  initialize() {
    if (this.initialized) {
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => (this.state[key] = value));
    this.initialized = true;
  }

  set(key: string, value: string) {
    this.initialize();

    if (
      (value == null && this.state[key] == null) ||
      value === this.state[key]
    ) {
      return;
    }
    if (value == null) {
      delete this.state[key];
    } else {
      this.state[key] = value;
    }
    const searchParams = new URLSearchParams(this.state);
    const url = '?' + searchParams.toString().replace(/%2C/g, ',');
    window.history.pushState({}, '', url);
  }

  get(key: string) {
    this.initialize();
    return this.state[key];
  }
}

const stateService = new StateService();
export default stateService;
