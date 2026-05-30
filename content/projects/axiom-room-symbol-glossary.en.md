---
title: "Axiom Room Symbol Glossary"
date: 2026-05-30T22:00:00+07:00
draft: false
math: false
type: "garden-note"
summary: "A short guide to the logical symbols used in Axiom Room, from implication to proof status."
categories: ["Digital Works", "Logic"]
tags: ["axiom room", "logic puzzle", "symbol glossary", "propositional logic"]
---

Axiom Room uses a small set of logical symbols to turn reasoning into playable blocks. This page is a compact glossary for the symbols that appear in the first twelve levels.

The symbols are not meant to make logic look distant or decorative. They are small machines. Each one changes how a statement can move, split, combine, or fail inside the room.

{{< mus-divider >}}

## Core symbols

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol mus-glossary__symbol--cluster">
        <span class="mus-glossary__label">Symbol</span>
        <code>P</code>
        <code>Q</code>
        <code>R</code>
        <code>S</code>
        <code>T</code>
      </div>
      <p class="mus-glossary__read">Read as: propositions</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Basic statement blocks. They stand for simple claims without saying what the claims are about.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>→</code>
      </div>
      <p class="mus-glossary__read">Read as: if... then...</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Implication. The statement on the left leads to the statement on the right.</p>
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
      <p class="mus-glossary__read">Read as: not</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Negation. It denies a statement or marks that the statement is false.</p>
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
      <p class="mus-glossary__read">Read as: not not</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Double negation. In the game, it can be unwrapped back into the original statement.</p>
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
      <p class="mus-glossary__read">Read as: and</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Conjunction. Both statements are joined into one block.</p>
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
      <p class="mus-glossary__read">Read as: or</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Disjunction. At least one branch is available. If one branch is ruled out, the other branch can remain.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P ∨ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>⊢</code>
      </div>
      <p class="mus-glossary__read">Read as: therefore / derives</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The selected blocks produce a valid result.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P, P → Q ⊢ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>⊬</code>
      </div>
      <p class="mus-glossary__read">Read as: does not derive</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The selected blocks do not produce a valid inference in the current level.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>P → Q, Q ⊬ P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Symbol</span>
        <code>■ Q.E.D.</code>
      </div>
      <p class="mus-glossary__read">Read as: proof complete</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">The target has been reached. The room accepts the proof.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Example</span>
        <code>■ Q.E.D.</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

{{< mus-divider >}}

## Rules used in the first twelve levels

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Modus Ponens</code>
      </div>
      <p class="mus-glossary__read">Appears in: Levels 1, 4, 6, 8, 9, 10, 11, 12</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If P leads to Q, and P is available, then Q follows.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P → Q</code>, <code>P</code> ⟶ <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Modus Tollens</code>
      </div>
      <p class="mus-glossary__read">Appears in: Levels 2, 4</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If P would lead to Q, but Q is false, then P cannot be accepted.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P → Q</code>, <code>¬Q</code> ⟶ <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Hypothetical Syllogism</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 3</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">Two implications can be connected into a longer chain.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P → Q</code>, <code>Q → R</code> ⟶ <code>P → R</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Conjunction Introduction</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 5</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If two statements are both available, they can be joined.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P</code>, <code>Q</code> ⟶ <code>P ∧ Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Simplification</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 6</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A conjunction can release one of its parts.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P ∧ Q</code> ⟶ <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Disjunctive Syllogism</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 7</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If one branch of an or-statement is denied, the other branch remains.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P ∨ Q</code>, <code>¬P</code> ⟶ <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Double Negation</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 8</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A statement denied twice returns to the original statement.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>¬¬P</code> ⟶ <code>P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Rule</span>
        <code>Contraposition</code>
      </div>
      <p class="mus-glossary__read">Appears in: Level 9</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">An implication can be rewritten by reversing and negating both sides.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Pattern</span>
        <code>P → Q</code> ⟶ <code>¬Q → ¬P</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

{{< mus-divider >}}

## Reading a proof block

A proof in Axiom Room is built by selecting compatible symbolic blocks. When the selection is valid, the game produces a new block. When the selection reaches the target, the level is complete.

For example:

{{< rawhtml >}}
<div class="mus-glossary">
  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Given</span>
        <code>P → Q</code>
        <code>P</code>
      </div>
      <p class="mus-glossary__read">Rule: Modus Ponens</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">From an available implication and its starting statement, the game yields the valid consequence.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Result</span>
        <code>Q</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Given</span>
        <code>P → Q</code>
        <code>¬Q</code>
      </div>
      <p class="mus-glossary__read">Rule: Modus Tollens</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">If the consequence fails, the original statement must also be rejected.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Result</span>
        <code>¬P</code>
      </p>
    </div>
  </section>

  <section class="mus-glossary__item">
    <div class="mus-glossary__head">
      <div class="mus-glossary__symbol">
        <span class="mus-glossary__label">Given</span>
        <code>P ∧ Q</code>
      </div>
      <p class="mus-glossary__read">Rule: Simplification</p>
    </div>
    <div class="mus-glossary__body">
      <p class="mus-glossary__meaning">A conjunction can be opened to retrieve one of its parts when the proof needs it.</p>
      <p class="mus-glossary__example">
        <span class="mus-glossary__label">Result</span>
        <code>P</code>
      </p>
    </div>
  </section>
</div>
{{< /rawhtml >}}

> In Axiom Room, a valid move is not always the winning move. Some levels include correct detours, decoys, or statements that lead away from the target.

{{< mus-divider >}}

## Small note

The first twelve levels are intentionally narrow. They focus on a few basic moves in propositional logic: following implications, denying consequences, joining statements, splitting conjunctions, eliminating branches, and recognizing proof status.

The goal is not to memorize symbols like museum labels. The goal is to feel how a proof moves.
