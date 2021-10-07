import Vue from 'vue';
import Vuelidate from 'vuelidate';
import getURLParam from './getURLParameter';

Vue.use(Vuelidate);

import ContactForm from './components/ContactForm';

const vueApp = document.querySelector('#app');

let allowUploads;
let allowTopic;
let currentTopic;

if (vueApp) {
    allowUploads = vueApp.dataset.allowUploads === 'true';
    allowTopic = vueApp.dataset.allowTopic === 'true';
    currentTopic = Number(vueApp.dataset.currentTopic);
}

new Vue({
    render: h =>
        h(ContactForm, {
            props: {
                allowUploads: allowUploads || true,
                allowTopic: allowTopic || true,
                currentTopic: Number(getURLParam('topic')) || currentTopic,
            },
        }),
}).$mount('#app');
