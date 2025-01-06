class SingletonContainer {
    constructor() {
        if(!SingletonContainer.instance) {
            this.instances = new Map();
            SingletonContainer.instance = this;
        }
        
        return SingletonContainer.instance;
    }
    
    register(key, instance) {
        if (this.instances.has(key)) {
            throw new Error(`해당 "${key}" 는 이미 등록되어 있습니다.`);
        }
        this.instances.set(key, instance);
    }

    get(key) {
        if (!this.instances.has(key)) {
            throw new Error(`해당 "${key}" 는 등록되어있지 않습니다.`);
        }
        
        return this.instances.get(key);
    }
}

module.exports = SingletonContainer;