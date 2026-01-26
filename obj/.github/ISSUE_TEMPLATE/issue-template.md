---
name: General Issue
about: Report a bug, propose an enhancement, or raise a domain-related concern
title: "[ISSUE] Short, clear description"
labels: []
assignees: []
---

## 📌 Issue Summary
Provide a clear and concise description of the issue, enhancement, or concern.

---

## 🧩 Issue Type
Please select one by marking with an `x`:

- [ ] Bug
- [ ] Enhancement / Feature Request
- [ ] Domain Logic Concern
- [ ] Documentation
- [ ] Refactor / Technical Debt
- [ ] Question / Clarification

---

## 📚 Context
Describe the context in which this issue occurs.

- Which domain concept(s) are involved?  
  (e.g. Booking, ConferenceRoom, BookingStatus)
- Is this related to a business rule, constraint, or lifecycle state?

---

## ❌ Current Behaviour
Describe the current behaviour or limitation.

- What happens now?
- Why is this a problem or concern?

---

## ✅ Expected Behaviour
Describe what you expected to happen instead.

- What rule should be enforced?
- What behaviour should change?

---

## 🧠 Domain Reasoning (Important)
Explain **why** this change or fix makes sense from a domain perspective.

Examples:
- Does this better reflect real-world behaviour?
- Does it protect an invariant?
- Does it prevent an invalid state?

---

## 🛠 Proposed Solution (Optional)
If you have an idea for a solution, describe it here.

- New method?
- State transition rule?
- Enum change?
- Validation in constructor?

_No implementation is required at this stage._

---

## 🧪 Acceptance Criteria
Define clear criteria for when this issue can be considered complete.

Example:
- [ ] Invalid state is no longer reachable
- [ ] Domain rule is enforced in one place
- [ ] No breaking changes to existing behaviour

---

## 📎 Additional Notes
Add any other context, references, or thoughts here.
