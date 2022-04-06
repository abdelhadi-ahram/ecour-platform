from hashids import Hashids

class Hasher:
	@staticmethod
	def encode(salt, value):
		hashids = Hashids(salt=salt, min_length=16)
		return hashids.encode(value)

	@staticmethod
	def decode(salt, value):
		hashids = Hashids(salt=salt, min_length=16)
		return hashids.decode(value)[0]
