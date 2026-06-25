---
title: "Glossary of Logic Symbols in Axiom Room"
date: 2026-06-25T10:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "A concise glossary for reading symbols, inference rules, and basic terms in Axiom Room."
categories: ["Logic", "Digital Works"]
tags: ["axiom room", "logic", "symbol glossary"]
---

A glossary for reading the symbols, inference rules, and basic terms that appear in Axiom Room.

## Basic Logic Symbols

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Symbol</span>
        <code>P</code>
        <code>Q</code>
        <code>R</code>
        <code>...</code>
      </div>
      <p class="mus-glossary__read">read as: statement</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Capital letters are used as symbols for statements. Their meaning is not fixed. In one level, <code>P</code> may be the starting point, while another symbol becomes the statement to derive.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>→</code>
      </div>
      <p class="mus-glossary__read">read as: if... then...</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Shows an implication. If the statement on the left is available, the statement on the right can be derived.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>¬</code>
      </div>
      <p class="mus-glossary__read">read as: not</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Marks the negation of a statement. <code>¬P</code> means that <code>P</code> does not hold.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>¬Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>¬¬</code>
      </div>
      <p class="mus-glossary__read">read as: not not</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A double negation returns the statement to its positive form.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>¬¬P</code> becomes <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>∧</code>
      </div>
      <p class="mus-glossary__read">read as: and</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Shows a conjunction, which joins two statements into one.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>∨</code>
      </div>
      <p class="mus-glossary__read">read as: or</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Shows a disjunction. If one branch is eliminated, the other branch can remain.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∨ Q</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Inference Rules

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Modus Ponens</code>
      </div>
      <p class="mus-glossary__read">pattern: from condition to result</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If an implication is available and its left-side condition is also available, the right-side result can be derived.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>P</code> produce <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Modus Tollens</code>
      </div>
      <p class="mus-glossary__read">pattern: from denied result to denied condition</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If the result of an implication is denied, the condition that would lead to it is denied too.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>¬Q</code> produce <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Hypothetical Syllogism</code>
      </div>
      <p class="mus-glossary__read">pattern: implication chain</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Two implications can be joined when their middle statement matches.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>Q → R</code> produce <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Conjunction Introduction</code>
      </div>
      <p class="mus-glossary__read">pattern: joining statements</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Two available statements can be joined into one conjunction.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P</code> and <code>Q</code> produce <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Simplification</code>
      </div>
      <p class="mus-glossary__read">pattern: taking part of a conjunction</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">From one joined statement, one of its parts can be taken out.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∧ Q</code> produces <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Disjunctive Syllogism</code>
      </div>
      <p class="mus-glossary__read">pattern: removing one branch</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If one branch of a disjunction is denied, the other branch can remain.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∨ Q</code> and <code>¬P</code> produce <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Double Negation</code>
      </div>
      <p class="mus-glossary__read">pattern: opening a double negation</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A statement with two negations can be read again as a positive statement.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>¬¬P</code> produces <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Contraposition</code>
      </div>
      <p class="mus-glossary__read">pattern: reversing an implication with negation</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">An implication can be rewritten by reversing its direction and negating both sides.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> becomes <code>¬Q → ¬P</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## UI Symbols and Notation

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">UI Symbol</span>
        <code>⊢</code>
      </div>
      <p class="mus-glossary__read">read as: derives / proves</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Marks a valid inference. In the Proof Log, the left side is the input, and the right side is the derived result.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P, P → Q ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">UI Symbol</span>
        <code>⊬</code>
      </div>
      <p class="mus-glossary__read">read as: does not derive</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Marks a block combination that does not match any inference rule in the current level.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>R</code> do not automatically produce <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">UI Symbol</span>
        <code>?</code>
      </div>
      <p class="mus-glossary__read">read as: unopened target</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Marks a target that has not yet been derived.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>? ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">UI Symbol</span>
        <code>■ Q.E.D.</code>
      </div>
      <p class="mus-glossary__read">read as: proven</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Marks the end of a proof. It appears when the level target has been derived.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>■ Q.E.D.</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Code notation</span>
        <code>-></code>
        <code>~</code>
        <code>&amp;</code>
        <code>v</code>
      </div>
      <p class="mus-glossary__read">read as: text forms of logic symbols</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">ASCII forms for logic symbols: <code>-></code> means <code>→</code>, <code>~</code> means <code>¬</code>, <code>&amp;</code> means <code>∧</code>, and <code>v</code> means <code>∨</code>.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P -> Q</code> is the same as <code>P → Q</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Gameplay Terms

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>premise</code>
      </div>
      <p class="mus-glossary__read">read as: starting statement</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A symbolic block available from the start of a level. Premises are the starting material for deriving the target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>P</code> in Level 1
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>target</code>
      </div>
      <p class="mus-glossary__read">read as: statement to prove</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The statement that must be derived to complete a level.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        target <code>V</code> in Level 18
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>symbolic block</code>
      </div>
      <p class="mus-glossary__read">read as: logic block</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A selectable button containing a logic statement. A block may be an initial premise or a derived result.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∧ Q</code>, <code>Q → R</code>, <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>derived statement</code>
      </div>
      <p class="mus-glossary__read">read as: derived result</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A new block created from a valid inference. It can be used in later steps.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        from <code>P → Q</code> and <code>P</code>, derive <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>inference</code>
      </div>
      <p class="mus-glossary__read">read as: reasoning step</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">One step of drawing a conclusion from selected inputs.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        selecting <code>P → Q</code> and <code>P</code> to produce <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>proof chain</code>
      </div>
      <p class="mus-glossary__read">read as: connected proof steps</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A sequence of connected inferences. The result of one step becomes input for the next.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P</code> becomes <code>Q</code>, then <code>Q</code> becomes <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Proof Log</code>
      </div>
      <p class="mus-glossary__read">read as: proof record</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A panel that records newly derived results. An inference whose output already exists does not add a new entry.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q, P ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Current Run</code>
      </div>
      <p class="mus-glossary__read">read as: current attempt</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The statistics for the level currently being played, including successful steps, invalid attempts, and hints used.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>2 successful steps, 0 invalid attempts, 1 hint used</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Best Record</code>
      </div>
      <p class="mus-glossary__read">read as: best saved result</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The best level record saved in the browser. Records compare hints, invalid attempts, then successful steps.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        a no-hint record is better than a record with one hint
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>clean solve</code>
      </div>
      <p class="mus-glossary__read">read as: clean completion</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A level completed with no invalid attempts and no hints. In the level selector, this status is marked with a star badge.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>0 invalid attempts</code> and <code>0 hints used</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>successful step</code>
      </div>
      <p class="mus-glossary__read">read as: valid new step</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A valid inference that creates a new block. An output that already exists is not counted as a new successful step.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∧ Q</code> produces <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>invalid attempt</code>
      </div>
      <p class="mus-glossary__read">read as: invalid try</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">An attempt to select blocks that do not form a valid inference.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        selecting two blocks that do not match the level rule
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>decoy path</code>
      </div>
      <p class="mus-glossary__read">read as: distracting path</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A logically valid step that does not help reach the target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        in Level 10, <code>Q ∧ T</code> acts as a decoy for target <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>branch</code>
      </div>
      <p class="mus-glossary__read">read as: proof branch</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A direction that can be taken from one symbol or disjunction. Some branches lead to the target, while others only create side results.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        from <code>P</code>, both <code>P → Q</code> and <code>P → R</code> are valid branches
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>side result</code>
      </div>
      <p class="mus-glossary__read">read as: non-target result</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A valid conclusion that is not the level target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>U</code> in Level 17 is valid, but the target is <code>V</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}

## Level Names and Proof Patterns

{{< rawhtml >}}

<div class="mus-glossary">

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>False Consequence</code>
      </div>
      <p class="mus-glossary__read">read as: valid but misleading consequence</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 11. It does not mean a false conclusion, but a valid consequence that does not help with the target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> produces <code>Q</code>, but the target is <code>R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Necessary Thread</code>
      </div>
      <p class="mus-glossary__read">read as: required path</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 12. Among several valid steps, only one chain really leads to the target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q → T</code> is needed, while <code>P → R → S</code> is only a detour
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Extended Thread</code>
      </div>
      <p class="mus-glossary__read">read as: longer proof path</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 13. The target sits at the end of a longer chain, even though shorter valid branches exist.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q → R → U</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Narrow Passage</code>
      </div>
      <p class="mus-glossary__read">read as: narrowed path</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 14. A disjunction must be narrowed before the path to the target opens.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∨ Q</code> and <code>¬P</code> leave <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Compressed Route</code>
      </div>
      <p class="mus-glossary__read">read as: shortened route</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 15. Several implications are combined into a shorter route before the final step.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q</code> and <code>Q → R</code> become <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Joined Premise</code>
      </div>
      <p class="mus-glossary__read">read as: joined premise</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 16. Two simple statements must be joined before they match the condition of an implication.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P</code> and <code>Q</code> become <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Split Attention</code>
      </div>
      <p class="mus-glossary__read">read as: divided attention</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 17. More than one block can be opened, but only one path leads to the target.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∧ R</code> helps reach <code>V</code>, while <code>Q ∧ S</code> leads to a side result
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>Quiet Apex</code>
      </div>
      <p class="mus-glossary__read">read as: quiet peak</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The name of Level 18. It closes the logic wing with double negation, side branches, contraposition, and a compressed route.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>Q → R</code> and <code>R → S</code> are compressed before reaching <code>V</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Term</span>
        <code>logic wing</code>
      </div>
      <p class="mus-glossary__read">read as: logic section</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The part of Axiom Room that contains symbolic inference levels. Players build steps from premises toward a target using available logic rules.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>The logic wing closes with a longer proof.</code>
      </p>
    </div>
  </section>

</div>
{{< /rawhtml >}}
