export const DEFAULT_TYPESCRIPT_CODE = `// Try some TypeScript code!

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};

console.log(user);

// Type checking works:
// This would cause a compile error:
// const wrongUser: User = { name: 42, age: "30" };
`;

// You can add more example codes here
export const MORE_EXAMPLES = {
  classes: `class Animal {
  constructor(private name: string) {}
  
  speak() {
    console.log(\`\${this.name} makes a sound.\`);
  }
}

const dog = new Animal("Dog");
dog.speak();`,

  generics: `function identity<T>(arg: T): T {
  return arg;
}

const num = identity(123);
const str = identity("hello");
console.log(num, str);`,
};
