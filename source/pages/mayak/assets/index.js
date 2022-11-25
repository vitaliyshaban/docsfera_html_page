(function () {
  // Компонент фильтр
  (function () {
    let filterGroupsMultiple = document.querySelectorAll('.filter-group--multiple');
    let filterGroupsSingle = document.querySelectorAll('.filter-group--single');

    // Множественный выбор
    for (const group of filterGroupsMultiple) {
      let headingBlock = group.children[1];
      let deleteTagsBtn = group.children[1].querySelector('button[data-role="delete-tags"]');
      let dropdownBlock = group.children[2];
      let dropdownBlockItem = group.children[2].querySelectorAll('li.dropdown-list__item');
      let tagsBlock = group.children[1].querySelector('ul.tags-list');
      let staticValue = group.children[1].querySelector('span[data-role="static-value"]');
      let formIsOpen = false;
      let arraySelected = [];

      // Показываем кнопку корзины только тогда, когда есть тэги
      function eachClickOnForm() {
        console.log(tagsBlock.children.length);
        if (tagsBlock.children.length !== 0) {
          deleteTagsBtn.classList.add('btn-delete-tags--visible');
        } else {
          deleteTagsBtn.classList.remove('btn-delete-tags--visible');
          staticValue.style.display = 'inline';
        }
      }

      // Обрабатываем клик по элементу из dropdown
      for (const item of dropdownBlockItem) {

        item.addEventListener('click', (e) => {
          function cretateItemTemplate() {
            let li = document.createElement('li');
            li.className = "tags-list__item";
            li.setAttribute('data-value', item.getAttribute('data-value'));

            let span = document.createElement('span');
            span.textContent = item.innerText;

            let btn = document.createElement('button');
            btn.type = 'button';
            btn.innerHTML = '&times';
            btn.setAttribute('data-role', 'remove-this-tag');
            btn.onclick = function (e) {
              e.stopPropagation();
              li.remove();
              item.style.display = 'flex';
              for (let i = 0; i < arraySelected.length; i++) {
                if (arraySelected[i] === li.getAttribute('data-value')) {
                  arraySelected[i] = '';
                  arraySelected.sort();
                  arraySelected.shift();
                }
              }
              eachClickOnForm();
            }

            li.append(span);
            li.append(btn);

            return li;
          }

          // Добавляем тэг в поле
          staticValue.style.display = 'none';
          tagsBlock.classList.add('tags-list--visible');
          tagsBlock.append(cretateItemTemplate());
          item.style.display = 'none';

          // Добавляем выбранный элемент в массив (для бэкенда)
          arraySelected.push(item.getAttribute('data-value'));
          arraySelected.sort();
        });
      }

      // При клике на форму
      headingBlock.addEventListener('click', () => {
        if (formIsOpen) {
          group.classList.remove('is-on');
          dropdownBlock.classList.remove('dropdown-list--visible');
          formIsOpen = false;
          return;
        }

        if (!formIsOpen) {
          group.classList.add('is-on');
          dropdownBlock.classList.add('dropdown-list--visible');
          formIsOpen = true;
          return;
        }
      });

      group.addEventListener('click', e => {
        e.stopPropagation();
        eachClickOnForm();

        // КОД НИЖЕ УДАЛИТЬ, ТОЛЬКО ДЛЯ ДЕБАГА!!!
        let formName = group.children[0];
        console.log(`data-values формы [${formName.innerText}]:`, arraySelected);
        console.log('\n');
      })

      // При клике на кнопку корзины
      deleteTagsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTagsBtn.classList.remove('btn-delete-tags--visible');
        tagsBlock.replaceChildren();
        staticValue.style.display = 'inline';
        dropdownBlockItem.forEach(element => {
          element.style.display = 'flex';
        });
        arraySelected = [];
      });

      // Если кликнули вне формы
      document.addEventListener('click', () => {
        formIsOpen = false;
        group.classList.remove('is-on');
        dropdownBlock.classList.remove('dropdown-list--visible');
      });
    }

    // Единичный выбор
    for (const group of filterGroupsSingle) {
      let headingBlock = group.children[1];
      let dropdownBlock = group.children[2];
      let dropdownBlockItem = group.children[2].querySelectorAll('li.dropdown-list__item');
      let staticValue = group.children[1].querySelector('span[data-role="static-value"]');

      // Обрабатываем клик по элементу из dropdown
      for (const item of dropdownBlockItem) {
        item.addEventListener('click', (e) => {
          // Добавляем тэг в поле
          staticValue.textContent = item.innerText;
          staticValue.setAttribute('data-value', item.getAttribute('data-value'));

          group.classList.remove('is-on');
          console.log(true);
          dropdownBlock.classList.remove('dropdown-list--visible');

          // КОД НИЖЕ УДАЛИТЬ, ТОЛЬКО ДЛЯ ДЕБАГА!!!
          let formName = group.children[0];
          console.log(`data-value формы [${formName.innerText}]:`, `${staticValue.getAttribute('data-value')} - ${staticValue.innerText}`);
          console.log('\n');
        });
      }

      // При клике на блок
      headingBlock.addEventListener('click', (e) => {
        e.stopPropagation();
        group.classList.toggle('is-on');
        dropdownBlock.classList.toggle('dropdown-list--visible');
      });

      // Если кликнули вне формы
      document.addEventListener('click', () => {
        group.classList.remove('is-on');
        dropdownBlock.classList.remove('dropdown-list--visible');
      });
    }
  })();

  // Расчитываем высоту wrapper для маленьких видео
  // (function () {
  //   let wrapper = document.querySelectorAll('.playlist__wrapper--scroll');
  //   let paddingTop = 16;
  //   let paddingBottom = 16;
  //   let gap = 20;
  //   let videoCardHeight = 150;
  //   let videoCardSmallHeight = 130;
  //   // const windowInnerHeight = window.innerHeight;

  //   console.log(windowInnerHeight);

  //   for (const elem of wrapper) {
  //     function checkResolution(height) {
  //       if (height >= 1100) {
  //         console.log('>больше 1100');
  //         elem.style.height = `${paddingTop + paddingBottom + videoCardHeight * 4 + gap * 3}px`;
  //       }

  //       if (height >= 920 && height <= 1100) {
  //         console.log('от 920 до 1000');
  //         elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight * 3 + gap * 2}px`;
  //       }

  //       if (height >= 750 && height <= 920) {
  //         console.log('от 920 до 1000');
  //         elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight * 2 + gap * 1}px`;
  //       }

  //       if (height >= 580 && height <= 750) {
  //         console.log('от 920 до 1000');
  //         elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight}px`;
  //       }
  //     }

  //     window.addEventListener("resize", function () {
  //       console.log(innerWidth);
  //       console.log(innerHeight);
  //     }, false);
  //   }
  // })();
})();