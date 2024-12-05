// Decorator to log method calls
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments: ${args}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// Decorator to log property access
function LogProperty(target: any, propertyKey: string | symbol) {
  let value = target[propertyKey];

  const getter = () => {
    console.log(`Getting value of ${String(propertyKey)}: ${value}`);
    return value;
  };

  const setter = (newValue: any) => {
    console.log(`Setting value of ${String(propertyKey)} to: ${newValue}`);
    value = newValue;
  };

  Object.defineProperty(target, propertyKey, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

export class Counter {
  @LogProperty
  private count: number = 0;

  @LogMethod
  increment() {
    this.count++;
  }

  @LogMethod
  decrement() {
    this.count--;
  }

  @LogMethod
  getCount(): number {
    return this.count;
  }
}

// Example usage
const counter = new Counter();
counter.increment();
counter.increment();
console.log(counter.getCount());
counter.decrement();
console.log(counter.getCount());
