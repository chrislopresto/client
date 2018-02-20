import { inject as service } from '@ember/service';
import FreestyleController from 'ember-freestyle/controllers/freestyle';

export default FreestyleController.extend({
  emberFreestyle: service(),

  colorPalette: {
    a: {
      name: 'blue',
      base: '#2F7498'
    },
    b: {
      name: 'coral',
      base: '#E5625C'
    },
    c: {
      name: 'dark coral',
      base: '#D1313D'
    },
    d: {
      name: 'hay',
      base: '#F9BF76'
    },
    e: {
      name: 'purple',
      base: '#615375'
    }
  },

  grayColorPalette: {
    a: {
      name: 'medium gray',
      base: '#183a4c'
    },
    b: {
      name: 'dark gray',
      base: '#444'
    },
    c: {
      name: 'light gray',
      base: '#d5e3ea'
    }
  },

  lightColorPalette: {
    a: {
      name: 'light red',
      base: '#FBE3E4'
    },
    b: {
      name: 'light yellow',
      base: '#FFF6BF'
    },
    c: {
      name: 'light green',
      base: '#E6EFC2'
    }
  },

  fontColorPalette: {
    a: {
      name: 'base font color (dark gray)',
      base: '#444'
    },
    b: {
      name: 'base accent color (blue)',
      base: '#2F7498'
    },
    c: {
      name: 'accent color (coral)',
      base: '#E5625C'
    }
  }
});
