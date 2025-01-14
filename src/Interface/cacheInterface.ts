abstract class CacheMemoryInterface {
    abstract get(key: string): Promise<string | null>;
    abstract set(key: string, value: string): Promise<void>;
}

export default CacheMemoryInterface;
