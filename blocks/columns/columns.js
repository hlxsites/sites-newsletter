import { decorateDefaultContent } from '../../scripts/functions.js';

export default async function decorate(block) {
  const cols = [...block.firstElementChild.children];
  const filteredClassList = [...block.classList]
    .filter((cls) => cls !== 'columns' && cls !== 'block');
  const type = filteredClassList.length ? `-${filteredClassList[0]}` : '';

  let mjml = `<mj-section mj-class="mj-colums${type}-cols-${cols.length}">`;

  const columnPromises = cols.map((div, index) => {
    return (async () => {
      const decoratedContent = await decorateDefaultContent(div);
      // eslint-disable-next-line no-nested-ternary
      return `<mj-column mj-class="mj-columns${type}-col mj-columns${type}-col-${index + 1} mj-columns${type}-col-${index === 0 ? 'first' : (index === cols.length - 1 ? 'last' : '')}">
        ${decoratedContent}
      </mj-column>
      `;
    })();
  });

  const columnStrings = await Promise.all(columnPromises);
  mjml += `${columnStrings.join('')}</mj-section>`;

  return mjml;
}
