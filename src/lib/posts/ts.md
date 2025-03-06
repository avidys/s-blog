---
title: Typescript goodies
author: "Avidys"
date: '2025-01-26'
categories:
  - Typescript
  - Svelte
published: true
---

Let me explain the key differences between TypeScript type and interface:

1. Extension/Inheritance:

```ts
// Interface can be extended
interface Animal {
  name: string;
}
interface Dog extends Animal {
  bark(): void;
}

// Type uses intersection
type Animal = {
  name: string;
}
type Dog = Animal & {
  bark(): void;
}
```

2. Declaration Merging:

```ts
// Interfaces can be merged
interface User {
  name: string;
}
interface User {
  age: number;
}
// Results in: interface User { name: string; age: number; }

// Types cannot be merged
type User = {
  name: string;
}
type User = {  // Error: Duplicate identifier 'User'
  age: number;
}
```

3. Computed Properties:

```ts
// Types can use computed properties
type Keys = 'firstname' | 'lastname';
type DuoName = {
  [key in Keys]: string;
}

// Interfaces cannot use computed properties directly
interface DuoName {
  [key in Keys]: string; // Error
}
```

4. Union Types:

```ts
// Types can be unions
type Status = 'pending' | 'approved' | 'rejected';

// Interfaces cannot be unions
interface Status = 'pending' | 'approved' | 'rejected'; // Error
```

5. Primitives and Tuples:

```ts
// Types can be primitive
type Name = string;
type Coordinates = [number, number];

// Interfaces must be objects
interface Name = string; // Error
interface Coordinates = [number, number]; // Error
```

6. General Guidelines:

   - Use interface when:
        - You need declaration merging
        - You're defining object shapes
        - You want to create an extensible API
        - Working with object-oriented design
   - Use type when:
        - You need unions or intersections
        - You're working with primitives
        - You need tuple types
        - You need computed properties
        - You want to create type aliases