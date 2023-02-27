class StateService {
  private state = {};

  constructor() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((value, key) => this.state[key] = value);
  }

  set(key, value) {
    if(value == null && this.state[key] == null || value === this.state[key]) {
      return;
    }
    if(value == null) {
      delete this.state[key];
    } else {
      this.state[key] = value;
    }
    const searchParams = new URLSearchParams(this.state);
    const url = '?' + searchParams.toString().replace(/%2C/g, ',');
    window.history.pushState('', '', url);
  }

  get(key) {
    return this.state[key];
  }
}

const stateService = new StateService();
export default stateService;
