<template>
    <div id="app" class="container">
        <!--  -->

        <div class="card mt-5">
            <div class="card-header">Создание пользователя</div>
            <div class="card-body">
                <form>
                    <div class="form-group">
                        <label for="fio">ФИО</label>
                        <input
                            v-model="fio"
                            :class="{invalid:($v.fio.$dirty && !$v.fio.length)}"
                            type="text"
                            class="form-control"
                            id="fio"
                        />
                        <small
                            v-if="$v.fio.$dirty && !$v.fio.length"
                            class="form-text error"
                        >ФИО должно быть длиной от 10 до 255 символов,сейчас {{fio.length}} символов.</small>
                    </div>
                    <div class="form-group">
                        <label for="InputEmail1">Email</label>
                        <input
                            v-model.trim="email"
                            :class="{invalid: ($v.email.$dirty && !$v.email.email) || ($v.email.$dirty && !$v.email.length)}"
                            type="email"
                            class="form-control"
                            id="InputEmail1"
                            aria-describedby="emailHelp"
                        />

                        <small
                            v-if="$v.email.$dirty && !$v.email.email"
                            class="form-text error"
                        >Некорректная почта</small>
                        <small
                            v-if="$v.email.$dirty && !$v.email.length"
                            class="form-text error"
                        >Почта должна быть длиной от 10 до 255 символов,сейчас {{email.length}} символов.</small>
                    </div>
                    <div class="form-group">
                        <label for="InputPhone">Телефон</label>
                        <input
                            :class="{invalid:  ($v.phone.$dirty && !$v.phone.validFormat)}"
                            type="text"
                            class="form-control"
                            id="InputPhone"
                            v-model.trim="phone"
                        />
                        <small
                            v-if="$v.phone.$dirty && !$v.phone.validFormat"
                            class="form-text error"
                        >Некорректный номер телефона</small>
                    </div>
                    <div class="form-group">
                        <label for="InputPassword1">Пароль</label>
                        <div class="input-group mb-3">
                            <input
                                v-model.trim="password"
                                :class="{invalid:($v.password.$dirty && !$v.password.length)}"
                                :type="hidePass?'password':'text'"
                                class="form-control"
                                id="Password"
                            />
                            <div class="input-group-append">
                                <div @click="hidePass=!hidePass" class="input-group-text">
                                    <i v-if="hidePass" class="fa fa-eye"></i>
                                    <i v-if="!hidePass" class="fa fa-eye-slash"></i>
                                </div>
                            </div>
                        </div>
                        <small
                            v-if="$v.password.$dirty && !$v.password.length"
                            class="form-text error"
                        >Пароль должен быть длиной от 6 до 36 символов,сейчас {{password.length}} символов.</small>
                    </div>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="$v.$dirty&&$v.$invalid"
                        @click.prevent="createUser()"
                    >Создать</button>
                </form>
            </div>
        </div>

        <!--  -->

        <table class="table table-bordered mt-5" v-if="users.length">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">ФИО</th>
                    <th scope="col">Email</th>
                    <th scope="col">Телефон</th>
                    <th scope="col">Пароль</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user,ind) of users" :key="user._id">
                    <th scope="row">{{ind+1}}</th>
                    <td>{{user.fio}}</td>
                    <td @click="user.show.em=!user.show.em">{{user.email | mask('email',user.show)}}</td>
                    <td @click="user.show.ph=!user.show.ph">{{user.phone | mask('phone',user.show)}}</td>
                    <td
                        @click="user.show.pw=!user.show.pw"
                    >{{user.password | mask('password',user.show)}}</td>
                </tr>
            </tbody>
        </table>
        <!--  -->
    </div>
</template>

<script>
import { email } from "vuelidate/lib/validators"
import axios from "axios"
import qs from "qs"

export default {
    name: "App",
    data() {
        return {
            fio: "",
            email: "",
            phone: '',
            password: "",

            hidePass: true,

            users: [],
        }
    },
    validations: {
        fio: {
            length: word => word.length >= 10 && word.length <= 255,
        },
        email: {
            email,
            length: word => word.length >= 10 && word.length <= 255,
        },
        phone: {
            validFormat: val => /^((\+7|7|8)+([0-9]){10})$/.test(val),
        },
        password: { length: word => word.length >= 6 && word.length <= 36 },
    },

    methods: {
        async createUser() {
            if (this.$v.$invalid) {
                this.$v.$touch()
                return
            }
            const data = {
                fio: this.fio,
                email: this.email,
                phone: this.phone,
                password: this.password,
            }
            try {
                const config = { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                const res = await axios.post(`http://localhost:3030/api/create`, qs.stringify(data), config)
                if (res.data.status == "success") {
                    this.users.push({ ...res.data.data, show: { em: false, ph: false, pw: false } })
                    this.resetForm()
                    this.$v.$reset()
                } else {
                    res.data.notValid.forEach(field => {
                        this[field] = ""
                    })
                    this.$v.$touch()
                }
            } catch (e) {
                console.log(e)
            }
        },

        resetForm() {
            this.fio = ""
            this.email = ""
            this.phone = ""
            this.password = ""
        },
        async getUsers() {
            try {
                const res = await axios.get(`http://localhost:3030/api/allusers`)
                const resUsers = res.data.data.map(u => {
                    u.show = { em: false, ph: false, pw: false }
                    return u
                })
                this.users = resUsers
            } catch (e) {
                console.log(e)
            }
        },
    },
    async created() {
        await this.getUsers()
    },
}
</script>

<style lang="scss">
.invalid {
    border: 1px solid red;
}
.error {
    color: red;
}
</style>
