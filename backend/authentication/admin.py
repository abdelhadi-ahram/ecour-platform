from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from .models import User, Teacher, Student, Department


class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    # is_teacher = forms.BooleanField(required=False)
    # student_department = forms.ModelChoiceField(queryset=Department.objects.all(), required=False)

    # is_student = forms.BooleanField(required=False)

    class Meta:
        model = User
        fields = ('email','first_name', 'last_name', 'cin', 'phone', 'adress', 'gender')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    # def clean_student_department(self):
    #     student_department = self.cleaned_data.get("student_department")
    #     is_student = self.cleaned_data.get("is_student")
    #     if not is_student and student_department:
    #         raise forms.ValidationError("You must set student with a department")
    #     return student_department

    # def clean_is_student(self):
    #     is_student = self.cleaned_data.get("is_student")
    #     is_teacher = self.cleaned_data.get("is_teacher")
    #     is_admin = self.cleaned_data.get("is_admin")
    #     student_department = self.cleaned_data.get('student_department')
    #     if is_student:
    #         if is_student == is_teacher:
    #             raise forms.ValidationError("This user can't be teacher and student in the sametime")
    #         if is_student == is_admin:
    #             raise forms.ValidationError("The student can not be an admin")
    #         if not student_department:
    #             raise forms.ValidationError("Department can not be null")
    #     return is_student


    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        # email = self.cleaned_data.get("email")
        # cin = self.cleaned_data.get("cin")
        # first_name = self.cleaned_data.get("first_name")
        # last_name = self.cleaned_data.get("last_name")
        # phone = self.cleaned_data.get("phone")
        # adress = self.cleaned_data.get("adress")
        # gender = self.cleaned_data.get("gender")

        # user = User(email=email, cin=cin, first_name=first_name, last_name=last_name, phone=phone, adress=adress, gender=gender)
        # user.set_password(self.cleaned_data["password1"])
        user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    is_teacher = forms.BooleanField()
    student_department = forms.ModelChoiceField(queryset=Department.objects.all())

    is_student = forms.BooleanField()

    class Meta:
        model = User
        fields = ('email', 'password', 'cin', 'phone', 'gender', 'is_active', 'is_admin')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]




class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'cin', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        ('Authentication', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name','cin' ,'phone', 'adress', 'gender')}),
        # ('Teacher', {
        #     'classes' : ('collapse',),
        #     'fields' : ("is_teacher", )
        #     }),
        # ('Student', {
        #     'classes' : ('collapse',),
        #     'fields' : ("is_student","student_department", )
        #     }),
        ('Permissions', {'fields': ('is_active','is_admin')}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        ('Authentication', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name','cin' ,'phone', 'adress', 'gender')}),
        # ('Teacher', {
        #     'classes' : ('collapse',),
        #     'fields' : ("is_teacher", )
        #     }),
        # ('Student', {
        #     'classes' : ('collapse',),
        #     'fields' : ("is_student","student_department", )
        #     }),
        ('Permissions', {'fields': ('is_active','is_admin')}),
    )

    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()




# Now register the new UserAdmin...
admin.site.register(User)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)

admin.site.register(Teacher)
admin.site.register(Student)
admin.site.register(Department)

