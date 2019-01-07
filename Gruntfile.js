/*
 * grunt-postmark
 * https://github.com/wildbit/grunt-postmark.git
 */

module.exports = function (grunt) {
  var secrets = grunt.file.readJSON("secrets.json");
  var config = grunt.file.readJSON("config.json");
  var templates = grunt.file.readJSON("templates.json");

  grunt.initConfig({
    secrets: secrets,
    config: config,
    templates: templates,

    /* Send emails using Postmark
     ------------------------------------------------- */
    postmark: {
      options: {
        serverToken: "<%= secrets.postmarkServerToken %>"
      },
      email: {
        from: "<%= config.postmark.from %>",
        to: "<%= config.postmark.to %>",
        subject: "<%= config.postmark.subject %>",
        src: ["test/emails/email.html"]
      },
      bulk: {
        from: "<%= config.postmark.from %>",
        to: "<%= config.postmark.to %>",
        subject: "<%= config.postmark.subject %>",
        src: ["test/emails/*.html"]
      }
    },

    /* Push templates from your local file system to Postmark
     ------------------------------------------------- */
    postmarkPushTemplates: {
      options: {
        serverToken: "<%= secrets.postmarkServerToken %>"
      },
      production: {
        templates: "<%= templates %>"
      },
      staging: {
        options: {
          serverToken: ""
        },
        templates: [
          {
            "name": "email alias 1",
            "alias": "email-1",
            "subject": "subject 1",
            "htmlBody": "test/emails/email.html",
            "textBody": "test/emails/email.txt"
          },
          {
            "name": "Fail 1",
            "alias": "fail-1",
            "subject": "subject",
            "textBody": "test/emails/empty.txt"
          }
        ]
      },
      noConfirmation: {
        options: {
          showConfirmation: false
        },
        templates: "<%= templates %>"
      }
    },

    /* This task will generate a boilerplate JSON config based on the templates that are currently on a specific Postmark server.
       The generated config can then be used with the "postmark-push-templates" task.
     ------------------------------------------------- */
    postmarkTemplatesSetup: {
      options: {
        serverToken: "<%= secrets.postmarkServerToken %>",
        configOutputFile: "templates-server.example.json",
        templateOutputDest: "test/dest"
      }
    }
  });

  grunt.loadTasks("tasks");
  grunt.registerTask("default", ["postmark"]);
};
