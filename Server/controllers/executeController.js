import { VM } from "vm2";

export const executeCode = (req, res) => {
  const { code } = req.body;

  try {
    const logs = [];

    const vm = new VM({
      timeout: 1000,
      sandbox: {
        console: {
          log: (...args) => logs.push(args.map(String).join(' ')),
        },
      },
    });

    vm.run(code);

    res.json({ output: logs.join('\n') || 'Code Executed Successfully' });
  } catch (err) {
    res.json({ error: err.message });
  }
};
