# AlgoVista — Interactive Algorithm Visualization Platform

**AlgoVista** is an interactive, web-based algorithm visualization platform built using **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Vitest**.

Rebuilt from the ground up from the original Streamlit/Python technical blueprint into a 60fps client-side architecture with zero backend latency, synchronized state machines, animated flowcharts, and NIST FIPS 46-3 cryptographic verification.

---

## 🚀 Tech Stack Comparison

| Component | Blueprint Specification | Modern Rebuild Technology | Advantage |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Streamlit (Python) | **React 19 + TypeScript (Vite)** | Zero reload overhead, 60fps transitions, instant client-side execution |
| **Styling & Design** | Injected Scoped CSS | **Tailwind CSS v4** | Hardware-accelerated transitions, dark mode palette, responsive design |
| **Flowcharting** | Graphviz DOT | **Custom Synchronized SVG Automaton** | Interactive node pulses, dynamic branch coloring, no external graphviz binary |
| **Charts & Bars** | Plotly Graph Objects | **Dynamic Flex & Scaled SVG/CSS Bars** | Instant reflow, responsive anchoring, card & bar view toggle |
| **Testing** | pytest (54 tests) | **Vitest (57 automated tests)** | Sub-second execution (388ms for 57 tests), strict typing |

---

## 📦 Workspaces & Features

### 1. 🫧 Bubble Sort Workspace
- **12-Stage Synchronized Flowchart**: Active nodes styled in gold fill (`#FFD54F`) with amber borders (`#FFA000`), decision diamonds displaying emerald **YES** and crimson **NO** branches.
- **Dual Visualizer Modes**: Switch seamlessly between **Plotly-style Scaled Bars** and **Value Card Pills**.
- **Pedagogical Step Insight Card**: Real-time breakdown of conditions, comparisons, swaps, and algorithmic significance.
- **Complexity**: $O(n^2)$ worst-case, $O(n)$ best-case with early termination detection, $O(1)$ auxiliary space.

### 2. 🔍 Binary Search Workspace
- **Search Space Interval Visualization**: Dynamic pointer callouts for **Low (L)**, **Mid (M)**, and **High (H)**.
- **Monotonic Interval Pruning**: Discarded search candidates are shaded and grayed out.
- **Step Formula & Invariant Card**: Tracks active candidate count and logarithmic halving $\lfloor(low + high)/2\rfloor$.
- **Complexity**: $O(\log n)$ time, $O(1)$ space.

### 3. 🔐 DES Encryption Engine (NIST FIPS 46-3)
- **Trace Depth**: Complete 108 execution trace steps.
- **NIST Test Vector Verified**:
  - Plaintext: `0123456789ABCDEF`
  - Key: `133457799BBCDFF1`
  - Ciphertext: `85E813540F0AB405`
- **Tab 1: 16-Round Summary Matrix**: Interactive tabular view of $K_i$, $L_i$, $R_i$, and $f(R_{i-1}, K_i)$ across all 16 rounds.
- **Tab 2: Interactive Feistel Diagram**: Visual Feistel architecture showing data flow, subkey injection, and round swaps.
- **Tab 3: Round-by-Round Deep Inspector**: Inspects each of the 6 sub-stages per round along with the **8 S-Box matrix lookups** displaying 6-bit input, outer bits (row), inner bits (column), and 4-bit output.
- **Tab 4: Non-Round Transformations**: Plaintext $\to$ IP $\to$ Pre-output $\to$ $\text{IP}^{-1}$ $\to$ Ciphertext.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Test Suite
```bash
npm test
```
*Executes all 57 automated unit and integration tests across Bubble Sort, Binary Search, and DES Encryption in under 500ms.*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized static bundle in `dist/`.
