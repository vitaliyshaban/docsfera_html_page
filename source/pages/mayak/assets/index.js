(function () {
  // Свернуть / развернуть текстовый блок
  (function () {
    let lecturerAccordion = document.querySelectorAll('.lecturer-accordion');

    for (const accordion of lecturerAccordion) {
      let accordionText = accordion.children[1];
      let accordionBtnShow = accordion.children[2].querySelector('button.lecturer-accordion__btn--show');
      let accordionBtnHide = accordion.children[2].querySelector('button.lecturer-accordion__btn--hide');

      // Развернуть
      accordionBtnShow.addEventListener('click', (e) => {
        e.preventDefault();

        accordionBtnShow.classList.remove('lecturer-accordion__btn--show');
        accordionBtnShow.classList.add('lecturer-accordion__btn--hide');
        accordionBtnHide.classList.add('lecturer-accordion__btn--show');
        accordionBtnHide.classList.remove('lecturer-accordion__btn--hide');
        accordionText.classList.add('is-on');

        accordionText.style.height = `${accordionText.scrollHeight}px`;
      });

      // Свернуть
      accordionBtnHide.addEventListener('click', (e) => {
        e.preventDefault();

        accordionBtnHide.classList.remove('lecturer-accordion__btn--show');
        accordionBtnHide.classList.add('lecturer-accordion__btn--hide');
        accordionBtnShow.classList.add('lecturer-accordion__btn--show');
        accordionBtnShow.classList.remove('lecturer-accordion__btn--hide');
        accordionText.classList.remove('is-on');

        accordionText.style.height = `80px`;
      });
    }
  })();

  // Компонент фильтр
  (function () {
    let filterGroups = document.querySelectorAll('.filter-group');
    let filterGroupsMultiple = document.querySelectorAll('.filter-group--multiple');
    let filterGroupsSingle = document.querySelectorAll('.filter-group--single');

    // Множественный выбор
    for (const group of filterGroupsMultiple) {
      let headingBlock = group.children[1];
      let deleteTagsBtn = group.children[1].querySelector('button[data-role="delete-tags"]');
      let dropdownBlock = group.children[1].querySelector('ul.dropdown-list');
      let dropdownBlockItem = group.children[1].querySelectorAll('li.dropdown-list__item');
      let tagsBlock = group.children[1].querySelector('ul.tags-list');
      let staticValue = group.children[1].querySelector('span[data-role="static-value"]');
      let formIsOpen = false;
      let arraySelected = [];

      // Показываем кнопку корзины только тогда, когда есть тэги
      function eachClickOnForm(itemLength) {
        if (tagsBlock.children.length !== 0) {
          deleteTagsBtn.classList.add('btn-delete-tags--visible');
        } else {
          deleteTagsBtn.classList.remove('btn-delete-tags--visible');
          staticValue.style.display = 'inline';
        }

        console.log('tagsBlock', tagsBlock.children.length);
        console.log('itemLength', itemLength);

        if (tagsBlock.children.length === itemLength) {
          group.classList.remove('is-on');
          dropdownBlock.classList.remove('dropdown-list--visible');
        } else {
          group.classList.add('is-on');
          dropdownBlock.classList.add('dropdown-list--visible');
        }
      }

      // Обрабатываем клик по элементу из dropdown
      for (const item of dropdownBlockItem) {
        item.addEventListener('click', (e) => {
          e.stopPropagation();

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
          deleteTagsBtn.classList.add('btn-delete-tags--visible');

          // Добавляем выбранный элемент в массив (для бэкенда)
          arraySelected.push(item.getAttribute('data-value'));
          arraySelected.sort();

          eachClickOnForm(dropdownBlockItem.length);
        });
      }

      // При клике на форму
      headingBlock.addEventListener('click', () => {
        // Удаляем все классы у всех элементов
        for (const eachGroup of filterGroups) {
          let dropdown = eachGroup.children[1].querySelector('ul.dropdown-list');
          eachGroup.classList.remove('is-on');
          dropdown.classList.remove('dropdown-list--visible');
        }

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
        eachClickOnForm(dropdownBlockItem.length);

        // КОД НИЖЕ УДАЛИТЬ, ТОЛЬКО ДЛЯ ДЕБАГА!!!
        let formName = group.children[0];
        console.log(`data-values формы [${formName.innerText}]:`, arraySelected);
        console.log('\n');
      });

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
      let dropdownBlock = group.children[1].querySelector('ul.dropdown-list');
      let dropdownBlockItem = group.children[1].querySelectorAll('li.dropdown-list__item');
      let staticValue = group.children[1].querySelector('span[data-role="static-value"]');
      let formIsOpen = false;

      // Обрабатываем клик по элементу из dropdown
      for (const item of dropdownBlockItem) {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          formIsOpen = false;

          // Добавляем тэг в поле
          staticValue.textContent = item.innerText;
          staticValue.setAttribute('data-value', item.getAttribute('data-value'));

          group.classList.remove('is-on');
          dropdownBlock.classList.remove('dropdown-list--visible');

          // КОД НИЖЕ УДАЛИТЬ, ТОЛЬКО ДЛЯ ДЕБАГА!!!
          let formName = group.children[0];
          console.log(`data-value формы [${formName.innerText}]:`, `${staticValue.getAttribute('data-value')} - ${staticValue.innerText}`);
          console.log('\n');
        });
      }

      // При клике на блок
      headingBlock.addEventListener('click', (e) => {
        // e.stopPropagation();

        // Удаляем все классы у всех элементов
        for (const eachGroup of filterGroups) {
          let dropdown = eachGroup.children[1].querySelector('ul.dropdown-list');
          eachGroup.classList.remove('is-on');
          dropdown.classList.remove('dropdown-list--visible');
        }

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
      });

      // Если кликнули вне формы
      document.addEventListener('click', () => {
        formIsOpen = false;
        group.classList.remove('is-on');
        dropdownBlock.classList.remove('dropdown-list--visible');
      });
    }
  })();

  // Расчитываем высоту wrapper "ЛЕКЦИОННЫЙ ПЛЕЙЛИСТ"
  (function () {
    let wrapper = document.querySelectorAll('.playlist__wrapper--scroll');
    let paddingTop = 16;
    let paddingBottom = 16;
    let gap = 20;
    let videoCardHeight = 150;
    let videoCardSmallHeight = 130;
    let windowInnerHeight = window.innerHeight;
    let windowInnerWidth = window.innerWidth;

    for (const elem of wrapper) {
      function checkResolution(height, width) {
        if (width > 1024) {
          if (height >= 1100) {
            elem.style.height = `${paddingTop + paddingBottom + videoCardHeight * 4 + gap * 3}px`;
          }

          if (height >= 920 && height <= 1100) {
            elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight * 3 + gap * 2}px`;
          }

          if (height >= 750 && height <= 920) {
            elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight * 2 + gap * 1}px`;
          }

          if (height >= 580 && height <= 750) {
            elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight}px`;
          }
        }

        if (width <= 1024 && width > 768) {
          elem.style.height = `${(paddingTop + paddingBottom) + videoCardHeight * 2 + gap * 1}px`;
        }

        if (width <= 768 && width > 576) {
          elem.style.height = `${(paddingTop + paddingBottom) + videoCardSmallHeight * 2 + gap * 1}px`;
        }

        if (width <= 576 && width >= 320) {
          elem.style.height = `${paddingTop + paddingBottom + videoCardSmallHeight * 4 + gap * 3}px`;
        }
      }

      checkResolution(windowInnerHeight, windowInnerWidth);

      window.addEventListener("resize", function (e) {
        checkResolution(e.target.innerHeight, e.target.innerWidth);
      }, false);
    }
  })();

  // Показать / скрыть фильтры
  (function () {
    let filterGroup = document.querySelectorAll('.filter-mayak-group');
    let windowInnerWidth = window.innerWidth;

    for (const group of filterGroup) {
      let filterBtn = group.querySelector('button[data-role="show-filter-block"]');
      let sortBtn = group.querySelector('button[data-role="show-sort-block"]');
      let filterBlock = group.querySelector('.s-filter.s-filter--hidden.s-filter--only-phone');
      let filterBlockOnlyFilter = group.querySelector('.s-filter.s-filter--hidden.s-filter--only-filter');
      let filterBlockOnlySort = group.querySelector('.s-filter.s-filter--hidden.s-filter--only-sort');

      filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (windowInnerWidth <= 1024) {
          filterBtn.classList.toggle('is-on');
          filterBlock.classList.toggle('is-on');
          return;
        }

        sortBtn.classList.remove('is-on');
        filterBlockOnlySort.classList.remove('is-on');

        if (filterBtn.classList.contains('is-on')) {
          filterBtn.classList.remove('is-on');
          filterBlockOnlyFilter.classList.remove('is-on');
          return;
        }

        if (!filterBtn.classList.contains('is-on')) {
          filterBtn.classList.add('is-on');
          filterBlockOnlyFilter.classList.add('is-on');
          return;
        }
      });

      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        filterBtn.classList.remove('is-on');
        filterBlockOnlyFilter.classList.remove('is-on');

        if (sortBtn.classList.contains('is-on')) {
          sortBtn.classList.remove('is-on');
          filterBlockOnlySort.classList.remove('is-on');
          return;
        }

        if (!sortBtn.classList.contains('is-on')) {
          sortBtn.classList.add('is-on');
          filterBlockOnlySort.classList.add('is-on');
          return;
        }
      });

      window.addEventListener('resize', (e) => {
        windowInnerWidth = e.target.innerWidth;
      });

      // Если кликнули вне формы
      document.addEventListener('click', () => {
        sortBtn.classList.remove('is-on');
        filterBtn.classList.remove('is-on');
        filterBlockOnlyFilter.classList.remove('is-on');
        filterBlockOnlySort.classList.remove('is-on');
        filterBlock.classList.remove('is-on');
      });
    }
  })();

  // Конфигурируем Swiper
  (function () {
    let lectorSlider = document.querySelectorAll('.lector-slider');

    for (const slider of lectorSlider) {
      const swiper = new Swiper(slider.children[0], {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 0,
        loop: false,

        navigation: {
          nextEl: '.lector-slider-controls__next',
          prevEl: '.lector-slider-controls__prev',
        },

        breakpoints: {
          1200: {
            slidesPerView: 2,
            spaceBetween: 24
          },
        }
      });
    }
  })();
})();