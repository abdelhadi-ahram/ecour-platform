from .models import ElementLog

def register(student=None, lecture=None, homework=None, element=None):
	if student is None:
		raise GraphQLError(makeJson("LOGIN", "You are not logged in"))
	if lecture:
		log = ElementLog(student=student, lecture=lecture)
		log.save()
	if homework:
		log = ElementLog(student=student, homework=homework)
		log.save()
	if element:
		log = ElementLog(student=student, element=element)
		log.save()