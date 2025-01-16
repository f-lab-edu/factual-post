class SingletonContainer {
    private static instance: SingletonContainer | null = null;
    private instances: Map<string, unknown>;

    constructor() {
        this.instances = new Map();
    }

    static getInstance(): SingletonContainer {
        if (!SingletonContainer.instance) {
            SingletonContainer.instance = new SingletonContainer();
        }
        return SingletonContainer.instance;
    }

    register<T>(key: string, instance: T): void {
        if (this.instances.has(key)) {
            throw new Error(`The key "${key}" is already registered.`);
        }
        this.instances.set(key, instance);
    }

    get<T>(key: string): T {
        if (!this.instances.has(key)) {
            throw new Error(`The key "${key}" is not registered.`);
        }
        return this.instances.get(key) as T;
    }
}

export default SingletonContainer;
