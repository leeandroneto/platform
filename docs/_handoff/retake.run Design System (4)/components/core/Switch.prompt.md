On/off toggle — terracotta track when on.

```jsx
const [on, setOn] = React.useState(true);
<Switch checked={on} onChange={setOn} />
```

Sizes `sm | md`. Controlled via `checked` + `onChange(next)`.
