import { inject as service } from '@ember/service';
import { computed } from '@ember/object'
import FreestyleController from 'ember-freestyle/controllers/freestyle';
import moment from 'moment';

export default FreestyleController.extend({
  emberFreestyle: service(),

  addons: computed('emberDisco', 'emberFlipFlop', 'emberRogueWip', function()  {
    return [
      this.get('emberDisco'),
      this.get('emberFlipFlop'),
      this.get('emberRogueWip')
    ];
  }),


  emberDisco: computed('date', function() {
    return {
      // BEGIN-FREESTYLE-USAGE c-addon-details
      name: 'ember-disco',
      description: 'A JavaScript dance party for the ages',
      repositoryUrl: 'https://github.com/ember-disco/ember-disco',
      latestVersionDate: this.get('date.weekAgo'),
      publishedDate: this.get('date.weekAgo'),
      license: 'MIT',
      ranking: 17,
      githubUsers: [
        { name: 'johnnyalpha' },
        { name: 'johnnybravo' }
      ],
      lastMonthDownloads: 17987,
      score: 8,
      isWip: false
      // END-FREESTYLE-USAGE
    }
  }),

  emberFlipFlop: computed('date', function() {
    return {
      // BEGIN-FREESTYLE-USAGE c-addon-list-flip-flop--notes
      name: 'ember-flip-flop',
      description: 'A whimsical feature flipping framework with no qualms or political affiliation',
      repositoryUrl: 'https://github.com/ember-flip-flop/ember-flip-flop',
      latestVersionDate: this.get('date.monthAgo'),
      publishedDate: this.get('date.monthAgo'),
      license: 'MIT',
      ranking: 222,
      githubUsers: [
        { name: 'johnnyalpha' },
        { name: 'johnnybravo' }
      ],
      lastMonthDownloads: 43,
      score: 2,
      isWip: false
      // END-FREESTYLE-USAGE
    }
  }),

  emberRogueWip: computed('date', function() {
    return {
      // BEGIN-FREESTYLE-USAGE c-addon-list-rogue-wip--notes
      name: 'ember-rogue-wip',
      description: 'A mischievous addon that toggles the WIP bit on random ember addons',
      repositoryUrl: 'https://github.com/ember-rogue-wip/ember-rogue-wip',
      latestVersionDate: this.get('date.yearAgo'),
      publishedDate: this.get('date.yearAgo'),
      license: 'MIT',
      ranking: 3000,
      githubUsers: [
        { name: 'johnnyalpha' },
        { name: 'johnnybravo' }
      ],
      lastMonthDownloads: 122,
      score: null,
      isWip: true
      // END-FREESTYLE-USAGE
    }
  }),

  date: computed(function() {
    return {
      minuteAgo: moment(moment.now()).add(-1, 'minute'),
      dayAgo: moment(moment.now()).add(-1, 'day'),
      weekAgo: moment(moment.now()).add(-1, 'week'),
      monthAgo: moment(moment.now()).add(-1, 'month'),
      yearAgo: moment(moment.now()).add(-1, 'year')
    };
  }),

  addonDetailsProperties: computed('date', function() {
    return {
      showRanking: {
        value: false,
        inputType: 'checkbox'
      },
      isDeprecated: {
        value: false,
        inputType: 'checkbox'
      },
      isOfficial: {
        value: false,
        inputType: 'checkbox'
      },
      isCliDependency: {
        value: false,
        inputType: 'checkbox'
      },
      ranking: {
        value: 1,
        inputType: 'number'
      },
      score: {
        value: 10,
        inputType: 'number'
      },
      name: {
        value: 'ember-addon-coin',
        inputType: 'input'
      },
      description: {
        value:
          'Embed your Ember app on the blockchain and profit',
        inputType: 'textarea'
      },
      latestVersionDate: {
        value: this.get('date.monthAgo').format('YYYY-MM-DD HH:mm:ss'),
        inputType: 'select',
        options: [
          this.get('date.minuteAgo').format('YYYY-MM-DD HH:mm:ss'),
          this.get('date.dayAgo').format('YYYY-MM-DD HH:mm:ss'),
          this.get('date.weekAgo').format('YYYY-MM-DD HH:mm:ss'),
          this.get('date.monthAgo').format('YYYY-MM-DD HH:mm:ss'),
          this.get('date.yearAgo').format('YYYY-MM-DD HH:mm:ss')
        ]
      }
    };
  }),

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
  },

  scoreColorPalette: {
    a: {
      name: '0',
      base: '#999'
    },
    b: {
      name: '1-2',
      base: '#ff7e63'
    },
    c: {
      name: '3-4',
      base: '#fbab61'
    },
    d: {
      name: '5-6',
      base: '#EDE217'
    },
    e: {
      name: '7-8',
      base: '#7ECF27'
    },
    f: {
      name: '9-10',
      base: '#28b36d'
    }
  }
});
