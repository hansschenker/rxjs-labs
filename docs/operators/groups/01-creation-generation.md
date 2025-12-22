# Creation / Generation v1 — Use Cases + Decision Tree

> Copy/paste into: `docs/operators/groups/01-creation-generation.md`

---

## Dominant use cases (10)

* **C-01 Static seed values** — Start a pipeline with a small fixed set of values (fixtures, demo data, bootstrapping).
* **C-02 Convert existing data structures** — Turn an Array/Iterable into a stream to reuse the RxJS pipeline toolbox.
* **C-03 Promise and async interop** — Convert a Promise into a stream so it composes with operators (and can be cancelled at the subscription boundary even if the Promise cannot).
* **C-04 DOM event streams** — Model UI interactions (click, input, keydown, scroll) as streams.
* **C-05 Time-driven sources** — Produce periodic ticks for polling, progress, animation, sampling, or cadence control.
* **C-06 Lazy per-subscription creation** — Ensure each subscriber gets a fresh source (fresh timestamp, new request, new random seed, new resource).
* **C-07 Resource lifecycle binding** — Acquire resources on subscribe and release them on unsubscribe/complete (sockets, WebSocket connections, event listeners).
* **C-08 Conditional source selection** — Choose a different source at runtime based on environment or state (feature flags, auth state, online/offline).
* **C-09 Controlled termination sources** — Represent “emit nothing,” “never completes,” or “fail immediately” in a precise way for composition and tests.
* **C-10 Deterministic test inputs** — Create stable, replayable sources for marble tests and documentation examples.

---

## Specialization decision tree (choose `of` vs `from` vs `defer`)

```mermaid
flowchart TD

%% =========================
%% L1: Main question
%% =========================
subgraph L1["L1 Intent"]
direction LR
I["Where do your values come from"]
A["I already have the values now"]
B["I have a container or Promise to convert"]
C["I need to create the source lazily per subscriber"]
end

%% =========================
%% L2: Choose direct creation
%% =========================
subgraph L2["L2 Direct creation"]
direction LR
A1["Small fixed set of values"]
B1["Array or Iterable"]
B2["Promise or async result"]
C1["Build source inside a factory"]
end

%% =========================
%% L3: Operators
%% =========================
subgraph L3["L3 Operators"]
direction LR
O1["of"]
O2["from"]
O3["defer"]
end

%% =========================
%% L4: Variants (optional)
%% =========================
subgraph L4["L4 Variants"]
direction LR
V1["fromEvent"]
V2["interval"]
V3["timer"]
end

%% =========================
%% Edges
%% =========================
I -->|"Values are already known"| A
I -->|"Convert an existing thing"| B
I -->|"Must be created at subscribe time"| C

A -->|"Use"| A1
A1 -->|"Use"| O1

B -->|"Use"| B1
B -->|"Use"| B2
B1 -->|"Use"| O2
B2 -->|"Use"| O2

C -->|"Use"| C1
C1 -->|"Use"| O3

%% Variant references
B1 -->|"DOM events"| V1
A -->|"Time ticks"| V2
A -->|"Time schedule"| V3
```

### Leaf notes

* Choose **`of`** when you want to **emit specific values you already have** (literal values, small fixed set, seed values).
* Choose **`from`** when you want to **convert** an existing container into a stream:

  * Array/Iterable → emits items
  * Promise → emits the resolved value (or errors)
* Choose **`defer`** when the source must be **constructed at subscription time** (fresh side effects per subscriber).

### Variant notes

* If the “existing thing” is a **DOM event source**, use **`fromEvent`** (specialized conversion for event targets).
* If the “values come from time,” use **`interval`** (regular cadence) or **`timer`** (one-shot delay or delayed start + cadence).
