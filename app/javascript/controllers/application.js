import "@hotwired/turbo-rails";
import { Application } from "@hotwired/stimulus";

import "timer";

const application = Application.start();
application.debug = false;
window.Stimulus = application;

export { application };
