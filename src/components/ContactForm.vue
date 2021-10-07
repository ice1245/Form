<template>
  <div class="main-container">
    <div v-cloak id="contact-us" ref="form-container" class="form-container">
      <div v-show="submitStatus === 'INVALID'">
        <form class="contact--form" @submit.prevent="submit">
          <div
              v-show="showTopicControl"
              :class="{ 'form-group--error': shouldShowError('selectedTopic') }"
              class="form-group"
          >
            <label for="topic">Topic</label>
            <div class="select-wrap">
              <select
                  id="topic"
                  class="form-control"
              >
                <option
                    v-for="item in availableTopics"
                    :key="item.value"
                    :value="item.value"
                >{{ item.label }}
                </option
                >
              </select>
            </div>
            <div v-if="shouldShowError('selectedTopic')" class="error">
              Please select a topic.
            </div>
          </div>
          <div
              :class="{ 'form-group--error': shouldShowError('name') }"
              class="form-group"
          >
            <label for="name">Name</label>
            <input
                id="name"
                v-model.trim="$v.name.$model"
                :class="{ 'form-control--error': shouldShowError('name') }"
                :style="showError('name') ?  getStyleInputError:getStyleInput "
                class="form-control"
                placeholder="Name"
                type="text"
            />
            <div v-if="shouldShowError('name')" class="error">
              Name is required and may not be longer than
              {{ $v.name.$params.maxLength.max }} characters.
            </div>
          </div>
          <div
              :class="{ 'form-group--error': shouldShowError('email') }"
              class="form-group"
          >
            <label for="email">Email</label>
            <input
                id="email"
                v-model.trim="$v.email.$model"
                :class="{ 'form-control--error': shouldShowError('email') }"
                :style="showError('email') ?  getStyleInputError:getStyleInput "
                class="form-control"
                placeholder="Email address"
                type="email"
            />
            <div v-if="shouldShowError('email')" class="error">
              Please provide a valid email.
            </div>
          </div>
          <div
              :class="{ 'form-group--error': shouldShowError('message') }"
              class="form-group"
          >
            <label for="message">Message</label>
            <textarea
                id="message"
                v-model.trim="$v.message.$model"
                :class="{ 'form-control--error': shouldShowError('message') }"
                :style="showError('message') ?  getStyleInputError:getStyleInput "
                class="form-control"
                name="message"
                rows="3"
            ></textarea>
            <div v-if="shouldShowError('message')" class="error">
              Message must be between {{ $v.message.$params.minLength.min }} and
              {{ $v.message.$params.maxLength.max }} characters.
            </div>
          </div>
          <div
              :class="{ 'form-group--error': shouldShowError('agree') }"
              class="form-checkbox"
          >
            <input
                id="checkbox"
                v-model="$v.agree.$model"
                :class="{ 'form-control--error': shouldShowError('agree') }"
                :style="shouldShowError ? getStyleInputError: getStyleInput "
                class="form-check-input"
                name="checkbox"
                type="checkbox"
            />
            <label class="form-check-label" for="checkbox">
              By submitting this form, you agree to the site's
              <a href="/privacy">online privacy statement</a>.
            </label>
            <div v-if="shouldShowError('agree')" class="error">
              You must agree with the site's online privacy statement.
            </div>
          </div>
          <div v-if="showUploadControl" class="form-group upload-component"
               style="display: flex; justify-content: space-between;">
            <div>
              <template v-if="showFileUpload">
                <label class="file-input-label" for="file"
                       style="padding: 12px 12px; text-align:center; background-color: white;color: #2c3e50;border: 1px solid orange;width: 120px;height: 25px;">Add
                  Attachment</label>
                <input
                    id="file"
                    ref="file"
                    :style="showValidationErrors ? getStyleInputError: getStyleInput "
                    accept=".pdf, .xlsx, .ics, .jpeg, .jpg, .pptx, .docx"
                    size="10485760"
                    style="display: none"
                    type="file" @change="setFile"
                />
              </template>
              <template v-else>
                <button
                    ref="removefile"
                    class="button action"
                    type="button"
                    @click="removeFile"
                >
                  Remove
                </button>
                <label>{{ file.name }}</label>
              </template>
              <p v-if="showUploadControl" class="inside-limits" style="display: none">
                6MB limit (PDF, XLSX, ICS, JPEG, JPG, PPTX, DOCX)
              </p>
            </div>
            <div class="form-actions">
              <button class="button action" type="submit">Send</button>
            </div>
          </div>
          <p v-if="showUploadControl" class="outside-limits">
            6MB limit (PDF, XLSX, ICS, JPEG, JPG, PPTX, DOCX)
          </p>
          <div class="recaptcha">
            <vue-recaptcha
                ref="recaptcha"
                sitekey="6LdxamEUAAAAAOKDW603fb3tE3DqVHqzUQzGAnoZ"
                size="invisible"
                @expired="onCaptchaExpired"
                @verify="onCaptchaVerified"
            ></vue-recaptcha>
          </div>
        </form>
      </div>

      <div v-show="submitStatus === 'PENDING'">
        <div class="loading-indicator"></div>
        <p>Hold on tight, we are sending your message.</p>
      </div>

      <div v-show="submitStatus === 'OK'" ref="form-message" class="form-message">
        <h1 class="h-accent no-transform">Thank you for contacting us!</h1>
        <p>We'll be in touch soon.</p>
      </div>

      <div
          v-show="submitStatus === 'ERROR'"
          ref="form-error"
          class="form-message"
      >
        <h1 class="h-accent no-transform">Uh oh!</h1>
        <p>
          We were unable to send the form at this time. Please try again later.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Style inputs, select elements and textareas */

.form-btn {
  display: flex;
  justify-content: space-between;
}

input[type=text],
input[type=email], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;

  box-sizing: border-box;
  resize: vertical;
}

/* Style the label to display next to the inputs */
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
  color: #034175;
}

/* Style the submit button */
input[type=submit] {
  background-color: #04AA6D;
  color: white;
  padding: 12px 20px;
  border: none;

  cursor: pointer;
  float: right;
}

/* Style the container */
.form-container {
  width: 50%;
  border-radius: 5px;
  padding: 20px;
}

button {
  background-color: white;
  color: #2c3e50;
  border: 1px solid orange;
  width: 120px;
  height: 45px;
}

@media screen and (max-width: 480px) {
  .form-container {
    width: 90%;
  }
}

.error {
  color: red;
}

.input_error {
  border-color: red;
}

@media screen and (max-width: 767px) {
  .form-container {
    width: 90%;
  }

}

.main-container {
  display: flex;
  justify-content: center;
}
</style>

<script>
import VueRecaptcha from 'vue-recaptcha';
import required from 'vuelidate/lib/validators/required';
import minLength from 'vuelidate/lib/validators/minLength';
import maxLength from 'vuelidate/lib/validators/maxLength';
import email from 'vuelidate/lib/validators/email';
import sendRequest from '../sendContactRequest';

export default {
  name: 'ContactForm',
  components: {VueRecaptcha},
  props: {
    allowUploads: Boolean,
    allowTopic: Boolean,
    currentTopic: Number,
  },

  data() {
    return {
      selectedTopic: this.currentTopic,
      availableTopics: [
        {label: 'Select One...', value: 0},
        {label: 'Future Ventures', value: 3407},
        {label: 'Cream City Venture Capital', value: 3408},
      ],
      name: '',
      message: '',
      email: '',
      file: null,
      style: '',
      agree: null,
      submitStatus: 'INVALID',
      formElement: null,
      showValidationErrors: false,
    };
  },
  mounted() {
    this.formElement = document.getElementById('contact-us');
    if (this.selectedTopic) {
      var topic = this.selectedTopic;
      var showTopic = this.availableTopics.filter(function (item) {
        return item.value == topic;
      });
      if (showTopic.length != 0) {
        showTopic[0].selected = true;
      }
    }
  },
  validations() {
    const mustBeTrue = value => value === true;
    const mustBeSelected = value => value !== 0;

    // let validations =
    let validations = {
      name: {
        required,
        maxLength: maxLength(80),
      },
      email: {
        required,
        email,
      },
      message: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(2000),
      },
      agree: {
        mustBeTrue,
      },
      selectedTopic: {
        mustBeSelected,
      },
    };

    return validations;
  },
  methods: {
    setFile() {
      this.file = this.$refs.file.files[0];
    },
    removeFile() {
      this.file = null;
    },
    onCaptchaVerified(recaptchaToken) {
      this.$refs.recaptcha.reset();
      const self = this;
      console.log(recaptchaToken, self)
      if (this.formElement && this.formElement.scrollIntoView) {
        setTimeout(() => {
          this.formElement.scrollIntoView();
        }, 0);
      }
      // return null
      return sendRequest({
        topic: this.selectedTopic,
        name: this.name,
        message: this.message,
        email: this.email,
        agree: this.agree,
        file: this.file,
        recaptchaToken: recaptchaToken,
      })
          .then(() => {
            self.submitStatus = 'OK';
          })
          .catch(() => {
            // console.log(error);
            self.submitStatus = 'ERROR';
          });
    },
    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },
    submit() {
      this.$v.$touch();
      //
      if (this.$v.$invalid) {
        this.submitStatus = 'INVALID';
        this.showValidationErrors = true;
      } else {
        this.submitStatus = 'PENDING';
        this.$refs.recaptcha.execute();
      }
    },
    shouldShowError(fieldName) {
      console.log(this.$v[fieldName].$error && this.showValidationErrors)
      return this.$v[fieldName].$error && this.showValidationErrors;
    },
    showError(fieldName) {
      return this.$v[fieldName].$error
    }
  },
  computed: {
    showFileUpload() {
      return this.file === null || this.file === undefined;
    },
    showUploadControl() {
      return this.allowUploads;
    },
    showTopicControl() {
      return this.allowTopic;
    },
    getStyleInputError() {
      return {'border-color': 'red'}
    },
    getStyleInput() {
      return {'border-color': '#ccc'}
    }
  },
};
</script>
