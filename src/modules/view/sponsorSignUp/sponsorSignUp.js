import { LightningElement, track } from "lwc";

// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const serialize = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

export default class ViewSponsorSignUp extends LightningElement {
  formData = {};

  @track haveSubmitted = false;
  @track showError = false;

  get canSubmit() {
    return !this.haveSubmitted && !this.showError;
  }

  handleChange = (event) => {
    this.formData[event.target.dataset.prop] = event.detail.value;
  };

  clear = () => {
    this.template.querySelectorAll("lightning-input").forEach((r) => {
      r.value = "";
    });
    this.template.querySelectorAll("lightning-input").forEach((r) => {
      r.value = "";
    });
    this.template.querySelectorAll("lightning-dual-listbox").forEach((r) => {
      r.value = "";
    });
    this.template.querySelectorAll("lightning-textarea").forEach((r) => {
      r.value = "";
    });
    this.formData = {};
  };

  handleCancel = () => {
    this.clear();
  };

  handleSubmit = async () => {
    const res = await fetch("/api/v1/post/Sponsor?" + serialize(this.formData));
    const resJson = await res.json();
    if (resJson.status === 'OK') {
      this.haveSubmitted = true;
      this.clear();
    } else {
      this.showError = true;
    }
  };
}
