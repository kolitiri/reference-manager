from contextlib import asynccontextmanager
from contextlog import contextlog

from fastapi import HTTPException, status


logger = contextlog.get_contextlog()

class DatabaseException(Exception):
	pass


class UnknownDatabaseType(DatabaseException):
	pass


class DatabaseConnectionError(DatabaseException):
	pass


class DocumentExists(DatabaseException):
	def __init__(self, title):
		super(DocumentExists, self).__init__()
		self.title = title


class DocumentDoesNotExist(DatabaseException):
	def __init__(self, title):
		super(DocumentDoesNotExist, self).__init__()
		self.title = title


class AuthenticationException(Exception):
	pass


class UnknownAuthenticationProvider(AuthenticationException):
	pass


class AuthorizationException(Exception):
	pass


class UnauthorizedUser(AuthorizationException):
	pass


class UserDoesNotExist(AuthorizationException):
	pass


class DiscoveryDocumentError(AuthorizationException):
	pass


class ProviderConnectionError(AuthorizationException):
	pass


@asynccontextmanager
async def exception_handling():
	try:
		yield
	except DatabaseConnectionError as exc:
		logger.exception(f"Failed to connect to the database: {repr(exc)}")
		raise HTTPException(status_code=500, detail="Cannot serve results at the moment. Please try again.")
	except DocumentExists as exc:
		logger.warning(f"Failed to insert document: {repr(exc)}")
		raise HTTPException(status_code=409, detail=f"Reference '{exc.title}' exists.")
	except DocumentDoesNotExist as exc:
		logger.warning(f"Failed to update document: {repr(exc)}")
		raise HTTPException(status_code=404, detail=f"Reference '{exc.title}' does not exist.")
	except UnauthorizedUser as exc:
		logger.warning(f"Failed to authorize user: {repr(exc)}")
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authorized")
	except Exception as exc:
		logger.exception(repr(exc))
		raise HTTPException(status_code=500, detail="An error has occurred. Please try again.")
