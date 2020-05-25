<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-toolbar-title
          >Planr -
          <span v-if="$auth.isAuthenticated"
            >{{ $auth.user.name }} </span
          ></v-toolbar-title
        >
      </div>
      <v-spacer></v-spacer>
        Video Møde : 
     <a href="https://zoom.us/" target="_blank"> <img src="../src/img/zoom.svg"  height="50px" width="50px" alt=""></a>
     <a href="https://www.skype.com/" target="_blank"> <img src="../src/img/skype.svg"  height="50px" width="50px" alt=""></a>
     <a href="https://www.microsoft.com/en-US/microsoft-365/microsoft-teams/group-chat-software" target="_blank"> <img src="../src/img/teams.svg"  height="50px" width="50px" alt=""></a>
     <a href="https://discord.com/" target="_blank"> <img src="../src/img/discord.svg"  height="50px" width="50px" alt=""></a>

      <v-btn v-if="!$auth.isAuthenticated" @click="login()" text>
        Log ind
      </v-btn>
      <v-btn v-else @click="logout()" text>
        Log ud
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row class="text-center" v-if="!$auth.isAuthenticated">
          <v-col class="mb-4">
            <h1 class="display-2 font-weight-bold mb-3 pri">
              Velkommen til Planr
            </h1>
            <p class="subheading font-weight-regular">
              Opret og planlæg dine events online
            </p>
            <p>
              <v-btn color="success" @click="login()">
                Log ind
              </v-btn>
            </p>
          </v-col>
        </v-row>
        <v-row v-else>
         

          <v-col cols="6">
            <h2 class="pri">Events</h2>
            <div>
              <v-list two-line>
                <v-list-item-group v-model="selectedEvent" multiple>
                  <template v-for="(item, index) in events">
                    <v-list-item :key="item.event_name">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title
                            class="blue--text"
                            v-text="item.event_name"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            class="text--primary"
                            v-text="item.description"
                          ></v-list-item-subtitle>
                          <v-list-item-subtitle>
                            {{item.tasks.length}} Opgaver
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-action-text
                            v-text="item.due_date"
                          ></v-list-item-action-text>
                          <v-btn
                            @click="manageTasks(item)"
                            text
                            color="success"
                            class="mt-1"
                          >
                            Tilføj Opgaver
                          </v-btn>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                    <v-divider :key="index"></v-divider>
                  </template>
                </v-list-item-group>
              </v-list>
            </div>
          </v-col>
          <v-col cols="4" class="offset-md-1">
            <h2 class="pri" >Opret Event</h2>
            <v-form ref="form">
              <v-text-field
                v-model="eventForm.event_name"
                label="Event navn"
                required
              ></v-text-field>
              <v-text-field
                v-model="eventForm.description"
                label="Event Beskrivelse"
                required
              ></v-text-field>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="eventForm.due_date"
                    label="Vælg Dato"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="eventForm.due_date"
                  @input="menu = false"
                ></v-date-picker>
              </v-menu>
              <v-btn
                color="success"
                class="mr-4"
                @click="addEvent()"
                :disabled="processing"
              >
                {{ processing ? "Adding..." : "Tilføj Event" }}
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline pri">Opgaver</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-list>
                    <template v-for="(task, index) in eventInView.tasks">
                      <v-list-item :key="task.title">
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="task.title"
                            :class="{ strike: task.done }"
                          ></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-avatar>
                          <v-checkbox v-model="task.done"></v-checkbox>
                        </v-list-item-avatar>
                               <v-btn class="delete" color="red" small dark  ><v-icon dark size="20px">mdi-cancel</v-icon></v-btn>
                      </v-list-item>
                      <v-divider :key="index"></v-divider>
                    </template>
                  </v-list>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Opgave beskrivelse"
                    required
                    v-model="newTask"
                  ></v-text-field>
                  <p>
                    <v-btn @click="addNewTask()" color="success">
                      Tilføj Opgave
                    </v-btn>
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" text @click="dialog = false"
              >Luk</v-btn
            >
            <v-btn
              color="success"
              text
              @click="saveEvent()"
              :disabled="updating"
              >{{ updating ? "Saving..." : "Gem Event" }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
      <v-footer height="auto" color="primary" dark>
        <v-layout text-center row wrap>
          <v-flex color="indigo" dark py-3 text-xs-center white--text xs12>
            &copy; {{ new Date().getFullYear() }} — <strong>Planr</strong>
          </v-flex>
        </v-layout>
      </v-footer>
  </v-app>
</template>
<script>
import db from "./db.js";
import { events_db } from "../firebase_auth.json";
export default {
  name: "App",
  data() {
    return {
      eventForm: {},
      menu: false,
      events: [],
      selectedEvent: [],
      dialog: false,
      eventInView: {},
      newTask: null,
      processing: false,
      updating: false,
      user: this.$auth.user
    };
  },
  async created() {
    let profile = await this.$auth.checkSession();
    this.$bind(
      "events",
      db.collection(events_db).where("user", "==", profile.email || "")
    );
  },
  methods: {
    login() {
      this.$auth.login();
    },
    logout() {
      this.$auth.logout();
    },
    async addEvent() {
      if (
        this.eventForm.event_name &&
        this.eventForm.description &&
        this.eventForm.due_date
      ) {
        this.eventForm.tasks = [];
        this.eventForm.user = this.$auth.user.email;
        this.processing = true;
        await db.collection(events_db).add(this.eventForm);
        this.processing = false;
    
        this.eventForm = {};
      } else {
        this.showModal("Error", "Udfyld alle felter");
      }
    },
    manageTasks(event) {
      this.eventInView = event;
      this.dialog = true;
    },
    addNewTask() {
      let taskId;
      if (this.eventInView.tasks.length > 0) {
        taskId =
          this.eventInView.tasks[this.eventInView.tasks.length - 1].id + 1;
      } else {
        taskId = 1;
      }
      let newTask = {
        id: taskId,
        title: this.newTask,
        done: false
      };
      this.eventInView.tasks.push(newTask);
      this.newTask = null;
    },
    async saveEvent() {
      this.updating = true;

      await db
        .collection(events_db)
        .doc(this.eventInView.id)
        .update({
          tasks: this.eventInView.tasks
        });
      this.updating = false;
      this.dialog = false;
    }
  }
};
</script>
<style scoped>
.strike {
  text-decoration: line-through;
}

.pri {
  color: #1976D2 !important;
}

img{
  margin: 0 10px;
  margin-top: 5px;
  opacity: 0.8;
}

img:hover{
  opacity: 1;
}

.delete{
  margin-left: 7px;
}

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
html {
  font-family: 'Noto Sans JP', sans-serif !important;
}



</style>