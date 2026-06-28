/**
 * Focus trap for modal dialogs. Keeps Tab navigation inside the modal
 * and restores focus to the previously focused element on close.
 */
const ModalFocus = (() => {
  let activeTrap = null;

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function getFocusableElements(modal) {
    return [...modal.querySelectorAll(FOCUSABLE)].filter(el => {
      return el.getAttribute('aria-hidden') !== 'true' && el.offsetParent !== null;
    });
  }

  function open(modal, options = {}) {
    if (!modal) return;
    close();

    const previouslyFocused = document.activeElement;
    const { onEscape, initialFocus } = options;

    function handleKeydown(event) {
      if (event.key === 'Escape' && typeof onEscape === 'function') {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusableElements(modal);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    modal.addEventListener('keydown', handleKeydown);

    activeTrap = {
      modal,
      previouslyFocused,
      handleKeydown,
      close() {
        modal.removeEventListener('keydown', handleKeydown);
        if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
          previouslyFocused.focus();
        }
      },
    };

    const focusTarget = initialFocus
      ? modal.querySelector(initialFocus)
      : getFocusableElements(modal)[0];

    if (focusTarget) {
      focusTarget.focus();
    }
  }

  function close() {
    if (!activeTrap) return;
    activeTrap.close();
    activeTrap = null;
  }

  return { open, close };
})();
