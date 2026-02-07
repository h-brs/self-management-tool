"use strict";

ccm.files["ccm.smt.js"] = {
  name: "smt",
  ccm: "https://ccmjs.github.io/ccm/ccm.js",
  config: {
    flash_cards: ["ccm.start", "https://wlueck.github.io/ccm-components/flash_cards/ccm.flash_cards.js", {
      "css.1": "https://wlueck.github.io/ccm-components/flash_cards/resources/styles.css",
      "html.1": "https://wlueck.github.io/ccm-components/flash_cards/resources/templates.html",
      "languages": {
        "de": "https://wlueck.github.io/ccm-components/flash_cards/resources/resources.js#de",
        "en": "https://wlueck.github.io/ccm-components/flash_cards/resources/resources.js#en"
      },
      "onchange": event => console.log(event),
      "text.1.url": "https://wlueck.github.io/ccm-components/flash_cards/resources/resources.js#de",
    }],
    timetable: ["ccm.start", "https://polykarp-bit.github.io/ccm-components/timetable/ccm.timetable.js", {
      "css.1": "https://polykarp-bit.github.io/ccm-components/timetable/resources/style.css",
    }],
    user: ["ccm.start", "https://ccmjs.github.io/akless-components/user/ccm.user.js", {
      logged_in: true,
    }],
  },
  Instance: function () {
    this.init = async () => {
      this.timetable.onchange = event => {
        console.log(event);
        if (event.event === "schedule") {
          const courses = this.flash_cards.getValue().courses.map(course => course.id);
          if (courses.includes(event.courseId)) {
            event.instance.element.querySelector("#modal-other-apps").appendChild(this.ccm.helper.html(`<div class="flash_cards">Flash!</div>`));
            debugger;
          }
        }
      };
    }
    this.start = async () => {
      this.element.innerHTML = `
        <div id="user"></div>
        <fieldset>
          <legend>Stundenplan</legend>
          <div id='timetable'></div>
        </fieldset>
        <fieldset>
          <legend>Karteikarten</legend>
          <div id='flash_cards'></div>
        </fieldset>
      `;
      this.element.querySelector("#user").appendChild(this.user.root);
      this.element.querySelector("#timetable").appendChild(this.timetable.root);
      this.element.querySelector("#flash_cards").appendChild(this.flash_cards.root);
    };
  }
}