import { createElement } from 'react';

import { addons, types, useArgs, useParameter } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';

const ADDON_ID = 'vue-materials';
const PANEL_ID = `${ADDON_ID}/panel`;

type ModifierOption = string | { value: string; label: string };

type ApiEntries = Record<string, string>;

interface VueMaterialsParameters {
  controls?: Record<string, {
    type?: 'checkbox-group';
    label?: string;
    options?: ModifierOption[];
  }>;
  api?: {
    props?: ApiEntries;
    slots?: ApiEntries;
    events?: ApiEntries;
  };
}

function VueMaterialsPanel({ active }: { active: boolean }) {
  const [args, updateArgs] = useArgs();
  const parameters = useParameter<VueMaterialsParameters>('vueMaterials', {});
  const controls = Object.entries(parameters.controls ?? {});

  const renderControl = ([argName, config]: typeof controls[number]) => {
    if (config.type !== 'checkbox-group' || !config.options?.length) return null;

    const value = (args[argName] ?? {}) as Record<string, boolean>;

    return createElement(
      'section',
      { key: argName, style: { marginBottom: '20px' } },
      createElement('h3', { style: { margin: '0 0 8px' } }, config.label ?? argName),
      ...config.options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label;

        return createElement(
          'label',
          {
            key: optionValue,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 0',
              cursor: 'pointer',
            },
          },
          createElement('input', {
            type: 'checkbox',
            checked: Boolean(value[optionValue]),
            onChange: (event: { currentTarget: { checked: boolean } }) => {
              const nextValue = { ...value };

              if (event.currentTarget.checked) {
                nextValue[optionValue] = true;
              } else {
                delete nextValue[optionValue];
              }

              updateArgs({ [argName]: nextValue });
            },
          }),
          label,
        );
      }),
    );
  };

  const renderApiCategory = (title: string, entries?: ApiEntries) => {
    if (!entries || !Object.keys(entries).length) return null;

    return createElement(
      'section',
      { key: title, style: { marginTop: '20px' } },
      createElement('h3', { style: { margin: '0 0 8px' } }, title),
      ...Object.entries(entries).map(([name, description]) =>
        createElement(
          'div',
          { key: name, style: { marginBottom: '10px' } },
          createElement('code', null, name),
          createElement('p', { style: { margin: '2px 0 0', opacity: 0.75 } }, description),
        ),
      ),
    );
  };

  return createElement(
    AddonPanel,
    { active },
    createElement(
      'div',
      { style: { padding: '16px', overflowY: 'auto', height: '100%' } },
      controls.length
        ? createElement('h2', { style: { margin: '0 0 12px' } }, 'Controls')
        : null,
      ...controls.map(renderControl),
      renderApiCategory('Props', parameters.api?.props),
      renderApiCategory('Slots', parameters.api?.slots),
      renderApiCategory('Events', parameters.api?.events),
    ),
  );
}

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Vue Materials',
    render: ({ active }) => createElement(VueMaterialsPanel, { active }),
  });
});
